module.exports = function(path) {
	var self = {};
	
	var fs = require("fs");
	var _path = require('path');

	self.path = path;
	self.data = null;

	self.read = function(callback) {
		fs.readFile(self.path, 'utf8', function(err, data) {
			if(err) {
				return console.log(err);
			}

			self.data = data;
			self.type = _path.extname(self.path);

			if(callback != null) {
				callback();
			}
		});
	}

	return self;
}
