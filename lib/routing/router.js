module.exports = function(jnode) {
	var self = {};

	var fs = require("fs");
	var file = require("./file");
	var promise = require("../utils/promise.js");

	self.folders = {};
	self.files = {};

	self.route = function(url, path, type) {
		return new promise(function(t, c) {
			var _file = file(path);
			_file.read()
			.then(function() {
				self.files[path] = _file.data;

				jnode.app.get("/" + url + "/" + filename, function(req, res) {
					t(req, res);

					res.type(type || _file.type);
					res.send(self.files[path]);
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
						self.folders[path][filename] = _file.data;

						jnode.app.get("/" + url + "/" + filename, function(req, res) {
							t(req, res);

							res.type(type || _file.type);
							res.send(self.folders[path][filename]);
						});
					})
					.catch(c);
				});
			});
		});
	}

	return self;
}
