module.exports = function(jnode) {
	var request = require('./request');
	var response = require('./response');
	var self = {};

	self.load = function(path) {
		return require("../../../../" + jnode.api_folder + "/" + path);
	}

	self.add = function(url, func) {
		app.use("/api/" + url, function(req, res) {
			var _response = response(res, req);
			var _request = request(req);

			func(_request, _response);

			_response.emit();
		});
	}

	return self;
}
