module.exports = function(jnode) {
	var self = {};
	
	var request = require('./request');
	var response = require('./response');

	self.load = function(path) {
		return require("../" + jnode.root + jnode.api_folder + "/" + path);
	}

	self.add = function(url, func) {
		jnode.app.use("/api/" + url, function(req, res) {
			var _response = response(res, req);
			var _request = request(req);

			func(_request, _response, jnode);

			_response.emit();
		});
	}

	return self;
}
