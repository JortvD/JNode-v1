var JNode = function() {
	var self = {};

	self.root = window.location.protocol + "//" + window.location.hostname + "/";
	self.api_url = "api";

	self.handshake = function() {

	}

	self.request = function() {
		return new Request(self);
	}

	return self;
}

var Request = function(jnode) {
	var self = {};

	var headers = {};
	var params = {};

	self.method = "POST";
	self.path = null;
	self.mime = null;

	self.header = function(key, value) {
		headers[key] = value;
	}

	self.param = function(key, value) {
		params[key] = value
	}

	self.send = function() {
		return new Promise(function(succes, failure) {
			var xhr = new XMLHttpRequest();

			if(self.method == "POST") {
				var data = new FormData();

				for(var key in params) {
					if(params.hasOwnProperty(key)) {
						data.append(key, params[key]);
					}
				}

				xhr.open(jnode.root + jnode.api_url + "/" + jnode.path);

				for(var key in headers) {
					if(params.hasOwnProperty(key)) {
						xhr.setRequestHeader(key, headers[key]);
					}
				}

				xhr.send(data);
			}
			else {

			}
		});
	}

	return self;
}

var Response = function() {
	var self = {};

	return self;
}

var Promise = function(func) {
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

	self.then = function(callback) {
		self.then_callback = callback;

		if(self.then_called && !self.then_executed) {
			self.then_callback.apply(this, self.then_args);
			self.then_executed = true;
		}

		return self;
	}

	self.on = function(callback) {
		return self.then(callback);
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
