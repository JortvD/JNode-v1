module.exports = function(jnode) {
	var self = {};

	var fs = require("fs");
	var file = require("./file");

	self.folders = {};
	self.files = {};

	self.route = function(url, path, cache, callback, type) {
		cache = cache || false;

		var _file = file(path);
		_file.read(function() {
			if(cache) {
				self.files[path] = _file.data;

				jnode.app.get("/" + url + "/" + filename, function(req, res) {
					if(callback != null) {
						if(callback(req, res) == true) {
							return;
						}
					}

					res.type(type || _file.type);
					res.send(self.files[path]);
				});
			}
		});
	}

	self.route_folder = function(url, path, cache, callback, type) {
		cache = cache || false;
		self.folders[path] = {};

		fs.readdir(path + "/", function(err, files) {
	        if(err) {
	            return console.log(err);
	        }

	        files.forEach(function(filename, index) {
				var _file = file("./" + path + "/" + filename);
				_file.read(function() {
					if(cache) {
						self.folders[path][filename] = _file.data;

						jnode.app.get("/" + url + "/" + filename, function(req, res) {
							if(callback != null) {
								if(callback(req, res) == true) {
									return;
								}
							}

							res.type(type || _file.type);
							res.send(self.folders[path][filename]);
						});
					}
				});
			});
		});
	}

	return self;
}
