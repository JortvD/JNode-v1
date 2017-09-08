/**
 * This is the request class. It is one of the parameters of an API controller. The request argument
 * contains everything that came with the person who requested it.
 * @module Request
 */
var request = function(req) {
	var self = {};

	var file = require("../utils/file");

	/**
	 * The method of the request (e.g. POST, GET).
	 * @constant method
	 */
	self.method = req.method;

	/**
	 * The URL that was requested by the user.
	 * @constant url
	 */
	self.url = req.originalUrl;

	/**
	 * The protocol the user used for the request (e.g. HTTP).
	 * @constant protocol
	 */
	self.protocol = req.protocol;

	/**
	 * The cookies that came with the request.
	 * @constant cookies
	 */
	self.cookies = req.cookies;

	/**
	 * The sessions that came with the request.
	 * @constant session
	 */
	self.session = req.session;

	/**
	 * The hostname specified in the request.
	 * @constant hostname
	 */
	self.hostname = req.hostname;

	/**
	 * If the request was requested using XMLHttpRequest.
	 * @constant xhr
	 */
	self.xhr = req.xhr;

	/**
	 * Is true when the request was canceled by one of the policies.
	 * @constant canceled
	 */
	self.canceled = false;

	/**
	 * Returns the specified value from the POST or GET parameters.
	 * @param  {String} name The parameter to get
	 * @return {String}      The specified parameter
	 * @function get
	 */
	self.get = function(name) {
		return req.query[name];
	}

	/**
	 * Returns if the type is equal to the requested content-type.
	 * @param  {String} type The type to match
	 * @return {Boolean}     If they match
	 * @function content
	 */
	self.content = function(type) {
		return req.is(type);
	}

	/**
	 * This function will load a file from the specified parameter.
	 * @param  {String} param The parameter to load the file from
	 * @return {File}         Will return the loaded file
	 */
	self.file = function(param) {
		var _file = new file();
		_file.data = self.get(parameter);
		return _file;
	}

	return self;
}

module.exports = request;
