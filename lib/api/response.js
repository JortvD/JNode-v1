/**
 * This is the response class. It is one of the parameters of an API controller. The response class
 * is used to write a JSON response for the request.
 * @module Response
 */
var response = function(res, req, jnode) {
	var self = {};

	var hash = jnode.helper("hash");

	/**
	 * This is the state of the response, if the respone hasn't been send yet, emitted will be false.
	 * @constant emitted
	 */
	self.emitted = false;

	/**
	 * The response is the most important part of this class. This variable is used to store all the
	 * data that will be send to the user. Since it is an object can just add data to and the data
	 * will be automatically parsed to JSON and send.
	 * @constant response
	 */
	self.response = {};

	/**
	 * The status code that will be send together with the response.
	 * @constant code
	 */
	self.code = 200;

	/**
	 * This function will change the response to a Bad Request error (400).
	 * @param  {Object} data The data to accompany the response
	 * @function bad_request
	 */
	self.bad_request = function(data) {
		self.error(400, self.status_text(400), data);
	}

	/**
	 * This function will change the response to a Unauthorized error (401).
	 * @param  {Object} data The data to accompany the response
	 * @function unauthorized
	 */
	self.unauthorized = function(data) {
		self.error(401, self.status_text(401), data);
	}

	/**
	 * This function will change the response to a Method Not Allowed error (405).
	 * @param  {Object} data The data to accompany the response
	 * @function method_not_allowed
	 */
	self.method_not_allowed = function(data) {
		self.error(405, self.status_text(405), data);
	}

	/**
	 * This function will change the response to a Too Many Requests error (429).
	 * @param  {Object} data The data to accompany the response
	 * @function too_many_requests
	 */
	self.too_many_requests = function(data) {
		self.error(429, self.status_text(429), data);
	}

	/**
	 * This function will change the response to a Internal Server Error (500).
	 * @param  {Object} data The data to accompany the response
	 * @function internal_server_error
	 */
	self.internal_server_error = function(data) {
		self.error(500, self.status_text(500), data);
	}

	/**
	 * This function will change the reponse to an error.
	 * @param  {Number} code    The code of the error
	 * @param  {String} message The error message
	 * @param  {Object} data    The data to accompany the response
	 * @function error
	 */
	self.error = function(code, message, data) {
		self.code = code;

		if(message != null) {
			self.response['message'] = message;
		}

		if(data != null) {
			self.response['data'] = message;
		}

		response.emit();
	}

	/**
	 * This function will return the text that goes with specified code.
	 * @param  {Number} code The status code
	 * @return {String}      The status text
	 * @function status_text
	 */
	self.status_text = function(code) {
		var text = {
			// Informational
			100: "Continue",
			101: "Switching Protocols",

			// Success
			200: "OK",
			201: "Created",
			202: "Accepted",
			203: "Non-Authoritative Information",
			204: "No Content",
			205: "Reset Content",
			206: "Partial Content",

			// Redirection
			300: "Multiple Choices",
			301: "Moved Permanently",
			302: "Found",
			303: "See Other",
			304: "Not Modified",
			305: "Use Proxy",
			307: "Temporary Redirect",
			308: "Permanent Redirect",

			// Client Error
			400: "Bad Request",
			401: "Unauthorized",
			402: "Payment Required",
			403: "Forbidden",
			404: "Not Found",
			405: "Method Not Allowed",
			406: "Not Acceptable",
			407: "Proxy Authentication Required",
			408: "Request Timeout",
			409: "Conflict",
			410: "Gone",
			411: "Length Required",
			412: "Precondition Failed",
			413: "Request Entity Too Large",
			414: "Request-URI Too Long",
			415: "Unsupported Media Type",
			416: "Requested Range Not Satisfiable",
			417: "Expectation Failed",
			426: "Upgrade Required",
			428: "Precondition Required",
			429: "Too Many Requests",
			451: "Unavailable For Legal Reasons",

			// Server Errors
			500: "Internal Server Error",
			501: "Not Implemented",
			502: "Bad Gateway",
			503: "Service Unavailable",
			504: "Gateway Timeout",
			505: "HTTP Version Not Supported",
			506: "Variant Also Negotiates (Experimental)",
			510: "Insufficient Storage (WebDAV)",
			511: "Loop Detected (WebDAV)",
			598: "Network read timeout error",
			599: "Network connect timeout error",
		};

		return text[code];
	}

	/**
	 * This function will set the specified cookie.
	 * @param  {String} key     The key to the cookie
	 * @param  {String} value   The value of the cookie
	 * @param  {Object} options Settings for the cookie (e.g. max-age)
	 * @function cookie
	 */
	self.cookie = function(key, value, options) {
		res.cookie(key, value, options);
	}

	self.handshake = function() {
		if(req.session != null && req.get("key") != null) {
			req.session["key"] = req.get("key");
			hash.generateKeys()
			.then(function(key) {
				self.response["key"] = key;
				self.emit();
			});
		}
	}

	/**
	 * This function will emit the response. It can only be called once.
	 * @function emit
	 */
	self.emit = function() {
		if(self.emitted) {
			return;
		}
		else {
			self.emitted = true;
		}

		res.type("json");
		res.status(self.code);

		self.response["code"] = self.code;

		var str = "";

		if(req.query["pretty"] != null) {
			str = JSON.stringify(self.response, null, '\t');
		} else {
			str = JSON.stringify(self.response);
		}

		if(req.session["key"] != null) {
			res.send(hash.client_encrypt(str, req.session["key"]));
		}
		else {
			res.send(str);
		}
	}

	return self;
}

module.exports = response;
