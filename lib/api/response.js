module.exports = function(res, req) {
	var self = {};
	self.response = {};
	self.code = 200;

	self.error = function(code, message, data) {
		self.code = code;

		if(message != null) {
			self.response['message'] = message;
		}

		if(data != null) {
			self.response['data'] = message;
		}
	}

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
			208: "Permanent Redirect",

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

	self.cookie = function(key, value, options) {
		res.cookie(key, value, options);
	}

	self.emit = function() {
		res.type("json");
		res.status(self.code);

		if(req.query["pretty"] != null) {
			res.send(JSON.stringify(self.response, null, '\t'));
		} else {
			res.send(JSON.stringify(self.response));
		}
	}

	return self;
}
