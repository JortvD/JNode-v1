module.exports = function() {
	var express = require('express');
	var app = express();
	var router = require('./routing/router')(app);
	var api = require('./api/api')(app);
	var server = null;
	var models = {};
	var helpers = {};
	var self = {};
	self.debug = false;

	self.start = function(port = 3000) {
		server = app.listen(port, function() {
			if(self.debug) {
				console.log("Started listening on port " + port + ".");
			}
		});
	}

	self.stop = function() {
		server.close(function() {
			if(self.debug) {
				console.log("Stopped listening on port " + server.address().port + ".");
			}
		});
	}

	self.api = function() {
		return api;
	}

	self.helper = function(name) {

	}

	self.assets = function(folder) {

	}

	self.model = function(file) {

	}

	self.view = function(url, file) {

	}

	self.mongo = function() {

	}

	return self;
}
