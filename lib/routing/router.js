module.exports = function(jnode) {
	var self = {};

	var fs = require("fs");
	var file = require("../utils/file");
	var promise = require("../utils/promise");

	self.folders = {};
	self.files = {};

	self.route = function(url, path, type) {
		return new promise(function(t, c) {
			var _file = file(path);
			_file.read()
			.then(function() {
				self.files[path] = _file;

				jnode.app.get("/" + url, function(req, res) {
					t(req, res, self.files[path]);

					res.type(type || _file.type);
				});
			})
			.catch(c);
		});
	}

	self.route_folder = function(url, path, type) {
		return new promise(function(t, c) {
			self.folders[path] = {};

			fs.readdir(path + "/", function(err, files) {
		        if(err) {
		            c(err);
					return;
		        }

		        files.forEach(function(filename, index) {
					var _file = file("./" + path + "/" + filename);
					_file.read()
					.then(function() {
						self.folders[path][filename] = _file;

						jnode.app.get("/" + url + "/" + filename, function(req, res) {
							t(req, res, self.folders[path][filename]);

							res.type(type || _file.type);
						});
					})
					.catch(c);
				});
			});
		});
	}

	return self;
}
