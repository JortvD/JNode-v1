module.exports = function(path) {
	var fs = require("fs");
	var self = {};
	self.path = path;
	self.data = null;

	self.read = function() {
		fs.readFile(self.path, 'utf8', function(err, data) {
			if(err) {
				return console.log(err);
			}

			console.log("DATA " + data);

			self.data = data;
		});
	}

	return self;
}
