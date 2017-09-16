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

	self.then_callback = null;
	self.catch_callback = null;
	self.then_called = false;
	self.catch_called = false;
	self.then_args = null;
	self.catch_args = null;
	self.then_executed = false;
	self.catch_executed = false;

	self.then_function = function(args) {
		if(self.then_callback != null) {
			self.then_callback.apply(this, arguments);
			self.then_executed = true;
		}

		self.then_args = arguments;
		self.then_called = true;
	}

	self.catch_function = function(args) {
		if(self.catch_callback != null) {
			self.catch_callback.apply(this, arguments);
			self.catch_executed = true;
		}

		self.catch_args = arguments;
		self.catch_called = true;
	}

	func(self.then_function, self.catch_function);

	/**
	 * The then function is called when the promise has finished.
	 * @function then
	 */
	self.then = function(callback) {
		self.then_callback = callback;

		if(self.then_called && !self.then_executed) {
			self.then_callback.apply(this, self.then_args);
			self.then_executed = true;
		}

		return self;
	}

	/**
	 * This function is a wrapper for the then function
	 * @function on
	 */
	self.on = function(callback) {
		return self.then(callback);
	}

	/**
	 * The catch function is called when there was an error in the promise.
	 * @function catch
	 */
	self.catch = function(callback) {
		self.catch_callback = callback;

		if(self.catch_called && !self.catch_executed) {
			self.catch_callback.apply(this, self.catch_args);
			self.catch_executed = true;
		}

		return self;
	}

	/*var queue = [];
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

	self.then = function(func_) {
		thens[thens.length] = func_;
		self.update();

		return self;
	}

	self.catch = function(func_) {
		catchs[catchs.length] = func_;
		self.update();

		return self;
	}

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
				calls += self.apply(catchs, "catch", args);
			}
			else {
				calls += self.apply(funcs[event], event, args);
			}

			if(calls == 0) {
				calls += self.apply(thens, "then", args);
			}

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

			func_.apply(this, args);

			calls++;
		}

		return calls;
	}

	func(self.event_then, self.event_catch);*/

	return self;
}

module.exports = promise;
