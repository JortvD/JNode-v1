module.exports = function(req) {
	var self = {};

	self.method = req.method;
	self.url = req.originalUrl;
	self.protocol = req.protocol;
	self.cookies = req.cookies;
	self.session = req.session;

	self.get = function(name) {
		return req.query[name];
	}

	self.content = function(type) {
		return req.is(type);
	}

	return self;
}
