/**
 * This the API class. It is returned by the main class and contains all the function you need for
 * loading and adding API controllers.
 * @module Api
 */
var api = function(jnode) {
	var self = {};

	var request = require('./request');
	var response = require('./response');

	/**
	 * This function will load the specified controller class making it simpler to load.
	 * @param  {String} path The path to the controller to require
	 * @return {Class}       The required controller
	 * @function load
	 */
	self.load = function(path) {
		return require("../" + jnode.root + jnode.api_folder + "/" + path);
	}

	/**
	 * This function will route and call back the specified controller.
	 * @param  {String} url    The URL to which the controller should routed
	 * @param  {Function} func The controller to route to
	 * @function add
	 */
	self.add = function(url, func) {
		jnode.app.use("/" + jnode.api_url + "/" + url, function(req, res) {
			var _response = response(res, req);
			var _request = request(req);

			func(_request, _response, jnode);

			_response.emit();
		});
	}

	return self;
}

module.exports = api;
