module.exports = function(app) {
	var fs = require("fs");
	var file = require("../helpers/file");
	var self = {};
	self.folders = {};

	self.route = function(url, path) {

	}

	self.route_folder = function(url, path, cache) {
		self.folders[url] = {};

		fs.readdir("./" + path + "/", function(err, files) {
	        if(err) {
	            return console.log(err);
	        }

	        files.forEach(function(filename, index) {
				var _file = file("./" + path + "/" + filename);
				_file.read();

				if(cache) {
					self.folders[url][filename] = _file.data;

					app.get("/" + url + "/" + filename, function(req, res) {
						res.send(self.folders[url][filename]);
					});
				}
			});
		});
	}

	return self;
}
