module.exports = function(path) {
	var fs = require("fs");
	var self = {};
	self.path = path;
	self.data = null;

	self.read = function(callback) {
		fs.readFile(self.path, 'utf8', function(err, data) {
			if(err) {
				return console.log(err);
			}

			self.data = data;

			if(callback != null) {
				callback();
			}
		});
	}

	return self;
}
