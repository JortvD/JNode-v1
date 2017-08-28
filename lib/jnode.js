module.exports = function() {
	var express = require('express');
	var app = express();
	var router = require('./routing/router')(app);
	var api = require('./api/api')(app);
	var mongo = require('./helpers/mongo');
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

	var get_helper = function(name, path) {
		if(helpers[name]) {
			return helpers[name];
		} else {
			return (helpers[name] = require(path));
		}
	}

	var get_model = function(name, path) {
		if(models[name]) {
			return models[name];
		} else {
			return (models[name] = require(path));
		}
	}

	self.helper = function(name) {
		switch(name) {
			case "file":
			case "mongo":
				get_helper(name, "./helpers/" + name);
				break;
			default:
				get_helper(name, "../../../helpers/" + name);
		}
	}

	self.assets = function(folder, callback) {
		router.route_folder(folder, "assets/" + folder, true, callback);
	}

	self.model = function(name) {
		get_model(name, "../../../models/" + name);
	}

	self.view = function(url, file, callback) {
		router.route(url, "views/" + file, true, callback);
	}

	self.mongo = function() {
		return mongo;
	}

	return self;
}
