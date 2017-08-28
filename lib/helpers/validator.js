module.exports = function() {
	var self = {};
	
	self.validators = {};

	self.add = function(name, func) {
		self.validators[name] = func;
	}

	self.validate = function(name, obj) {
		return self.validators[name](obj);
	}

	return self;
}
