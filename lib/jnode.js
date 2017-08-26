module.exports = function() {
	var express = require('express');
	var api = require('./api/api');
	var app = express();
	var server = null;
	var self = {};
	self.debug = false;

	self.start = function(port = 3000) {
		server = app.listen(port, function() {
			if(self.debug) {
				console.log("Started listening on port " + port + "!");
			}
		});
	}

	self.stop = function() {
		server.close(function() {
			if(self.debug) {
				console.log("Stopped listening on port " + server.address().port + "!");
			}
		});
	}

	self.api = function(section, path) {
		var _api = api(section, path);
	}

	self.helper = function(name) {

	}

	self.load = function(path) {

	}

	self.view = function(path) {

	}

	return self;
}
