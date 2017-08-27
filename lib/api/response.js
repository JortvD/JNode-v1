module.exports = function(res, req) {
	var self = {};
	self.response = {};
	self.code = 200;

	self.error = function(code, message, data) {
		self.code = code;

		if(message != null) {
			self.response['message'] = message;
		}

		if(data != null) {
			self.response['data'] = message;
		}
	}

	self.cookie = function(key, value, options) {
		res.cookie(key, value, options);
	}

	self.emit = function() {
		res.type("json");
		res.status(self.code);

		console.log(req.param("pretty"));

		if(req.param("pretty") != null) {
			res.send(JSON.stringify(self.response, null, '\t'));
		} else {
			res.send(JSON.stringify(self.response));
		}
	}

	return self;
}
