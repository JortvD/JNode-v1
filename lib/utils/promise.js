module.exports = function(func) {
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
		if(self.then_callback != null && !self.then_called && !self.then_executed) {
			self.then_callback.apply(this, arguments);
			self.then_executed = true;
		}

		self.then_args = arguments;
		self.then_called = true;
	}

	self.catch_function = function(args) {
		if(self.catch_callback != null && !self.catch_called && !self.catch_executed) {
			self.catch_callback.apply(this, arguments);

			self.catch_executed = true;
		}

		self.catch_args = arguments;
		self.catch_called = true;
	}

	func(self.then_function, self.catch_function);

	self.then = function(callback) {
		self.then_callback = callback;

		if(self.then_called && !self.then_executed) {
			self.then_callback.apply(this, self.then_args);
			self.then_executed = true;
		}

		return self;
	}

	self.catch = function(callback) {
		self.catch_callback = callback;

		if(self.catch_called && !self.catch_executed) {
			self.catch_callback.apply(this, self.catch_args);
			self.catch_executed = true;
		}

		return self;
	}

	return self;
}
