module.exports = function(jnode) {
	var self = {};

	var fs = require("fs");
	var file = require("../utils/file");
	var promise = require("../utils/promise");

	self.folders = {};
	self.files = {};

	self.route = function(url, path, type) {
		return new promise(function(succes, failure) {
			var _file = file(path);
			_file.read()
			.then(function() {
				self.files[path] = _file;

				jnode.app.get("/" + url, function(req, res) {
					res.type(type || _file.type);

					succes(req, res, self.files[path]);
				});
			})
			.catch(failure);
		});
	}

	self.route_folder = function(url, path, type) {
		return new promise(function(succes, failure) {
			if(self.folders[path] == null) {
				self.folders[path] = {};
			}

			console.log("Routing folder: " + path);

			fs.readdir(path + "/", function(err, files) {
		        if(err) {
		            failure(err);
					return;
		        }

		        console.log("Found files: " + files);

		        files.forEach(function(filename, index) {
					var _file = file(path + "/" + filename);

					console.log("Routing file: " + filename);

					_file.read()
					.then(function() {
						self.folders[path][filename] = _file;

						console.log("Routing file: " + filename + " to: " + "/" + url + "/" + filename);

						jnode.app.get("/" + url + "/" + filename, function(req, res) {
							res.type(type || _file.type);

							succes(req, res, self.folders[path][filename]);
						});
					})
					.catch(failure);
				});
			});
		});
	}

	return self;
}
