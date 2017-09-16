/**
 * The promise class is used for creating multiple callback. The "catch" callback will be executed when there was an error 
 * and the "then" callback will be executed when there was a non-error event. For specific events use the "on" function.
 * @example
 * promise()
 * .then(function(val) {
 *   console.log(val);
 * })
 * .catch(function(err) {
 *   console.log(err);
 * })
 * .on("load", function(val) {
 *   console.log(val);
 * });
 * @module Promise
 */
var promise = function(func) {
	var self = {};

	var queue = [];
	var funcs = {};
	var thens = [];
	var catchs = [];

	self.event = function(event_, ...args) {
		queue[queue.length] = {
			event: event_,
			arguments: args
		}

		self.update();
	}

	self.event_then = function(...args) {
		queue[queue.length] = {
			event: "then",
			arguments: args
		}

		self.update();
	}

	self.event_catch = function(...args) {
		queue[queue.length] = {
			event: "catch",
			arguments: args
		}

		self.update();
	}

	/**
	 * This function will be called back when the event wasn't an error. It is not suggested to use this class since it will 
	 * cancel out all non-error events when using synchronous function
	 * @param  {Function} func_ The callback then function
	 */
	self.then = function(func_) {
		thens[thens.length] = func_;
		self.update();

		return self;
	}

	/**
	 * This function will be called when there was an error event. The possible error events are "error", "catch", "failure", 
	 * "reject" and "err"
	 * @param  {Function} func_ The callback catch function
	 */
	self.catch = function(func_) {
		catchs[catchs.length] = func_;
		self.update();

		return self;
	}

	/**
	 * This function will be called on the specified event.
	 * @param  {String} event   The event
	 * @param  {Function} func_ The callback function
	 */
	self.on = function(event, func_) {
		self.insert(event, func_);
		self.update();

		return self;
	}

	self.insert = function(event, func_) {
		if(funcs[event] == null) {
			funcs[event] = [];
		}

		var funcs_ = funcs[event];

		funcs_[funcs_.length] = func_;
	}

	self.update = function() {
		for(var i = 0; i < queue.length; i++) {
			var item = queue[i];
			var event = item.event;
			var args = item.arguments;
			var calls = 0;

			if(event == "catch" || event == "error" || event == "failure" || event == "reject" || event == "err") {
				calls += self.apply(catchs, "catch", args, event);
			}
			else {
				calls += self.apply(thens, "then", args, event);
			}

			calls += self.apply(funcs[event], event, args);

			if(calls > 0) {
				queue = queue.slice(i - 1, i);
			}
		}
	}

	self.apply = function(funcs_, event, args, event_) {
		var calls = 0;

		if(funcs_ == null) {
			return 0;
		}

		for(var i = 0; i < funcs_.length; i++) {
			var func_ = funcs_[i];

			if(event_ != null) {
				func_(event_, ...args);
			}
			else {
				func_.apply(this, args);
			}

			calls++;
		}

		return calls;
	}

	func(self.event_then, self.event_catch, self.event);

	return self;
}

module.exports = promise;
