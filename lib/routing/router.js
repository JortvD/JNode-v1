module.exports = function(app) {
	var fs = require("fs");
	var file = require("../helpers/file");
	var self = {};
	self.folders = {};
	self.files = {};

	self.route = function(url, path, cache) {
		var _file = file("./" + path);
		_file.read(function() {
			if(cache) {
				self.files[path] = _file.data;

				app.get("/" + url + "/" + filename, function(req, res) {
					res.send(self.files[path]);
				});
			}
		});
	}

	self.route_folder = function(url, path, cache) {
		self.folders[path] = {};

		fs.readdir("./" + path + "/", function(err, files) {
	        if(err) {
	            return console.log(err);
	        }

	        files.forEach(function(filename, index) {
				var _file = file("./" + path + "/" + filename);
				_file.read(function() {
					if(cache) {
						self.folders[path][filename] = _file.data;

						app.get("/" + url + "/" + filename, function(req, res) {
							res.send(self.folders[path][filename]);
						});
					}
				});
			});
		});
	}

	return self;
}
