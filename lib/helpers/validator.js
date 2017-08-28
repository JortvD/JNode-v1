module.exports = function() {
	var self = {};
	self.validators = {};

	self.add = function(name, func) {
		self.validators[name] = func;
	}

	self.validate = function(name, string) {
		return self.validators[name](string);
	}

	return self;
}
