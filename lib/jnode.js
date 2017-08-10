module.exports = function() {
	var express = require('express');
	var app = express();
	var self = {};

	self.start = function(port = 3000) {
		app.listen(port, function() {
			console.log("Started EXPRESS on port " + port + "!");
		});
	}

	return self;
}
