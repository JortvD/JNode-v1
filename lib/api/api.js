/**
 * This the API class. It is returned by the main class and contains all the function you need for
 * loading and adding API controllers.
 * @module Api
 */
var api = function(jnode) {
	var self = {};

	var request = require('./request');
	var response = require('./response');
	var promise = require('../utils/promise');
	var policies = {};

	/**
	 * This function will load the specified controller class making it simpler to load.
	 * @param  {String} path The path to the controller to require
	 * @param  {String} type The type of class you want to load, API controller or policy
	 * @return {Class}       The required controller
	 * @function load
	 */
	self.load = function(path, type) {
		switch(type) {
			case "policy":
				return require("../" + jnode.root + jnode.policies_folder + "/" + path);

			default:
				return require("../" + jnode.root + jnode.api_folder + "/" + path);

		}

	}

	/**
	 * This function will add a new policy to the API class.
	 * @param  {String}   name     The name of the policy
	 * @param  {Function} callback The policy callback
	 */
	self.policy = function(name, callback) {
		policies[name] = callback;
	}

	/**
	 * This function will route and call back the specified controller.
	 * @param  {String} url    The URL to which the controller should routed
	 * @param  {Array} pols    The policies to use for this API controller
	 * @return {Promise}       Will return a promise
	 * @function add
	 */
	self.add = function(url, pols) {
		return new promise(new function(succes, failure) {
			jnode.app.use("/" + jnode.api_url + "/" + url, function(req, res) {
				var _response = response(res, req);
				var _request = request(req);

				for(var key in pols) {
					var policy = policies[pols[key]];

					if(policy != null) {
						policy(_request, _response, jnode);

						if(_response.emitted) {
							return;
						}
					}
				}

				if(!_request.canceled) {
					succes(_request, _response, jnode);
				}
			});
		});
	}

	return self;
}

module.exports = api;
