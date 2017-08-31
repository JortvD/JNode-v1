module.exports = function(path) {
	var self = {};

	var fs = require("fs");
	var _path = require('path');
	var promise = require("../utils/promise.js");

	self.path = path;
	self.data = null;

	self.read = function(callback) {
		return new promise(function(t, c) {
			fs.readFile(self.path, 'utf8', function(err, data) {
				if(err) {
					c(err);
				}

				self.data = data;
				self.type = _path.extname(self.path);

				t();
			});
		});
	}

	return self;
}
