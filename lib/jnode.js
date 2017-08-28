module.exports = function() {
	var self = {};
	var express = require('express');
	var app = express();
	var router = require('./routing/router')(app);
	var api = require('./api/api')(self);
	var mongo = require('./helpers/mongo');
	var server = null;
	var models = {};
	var helpers = {};

	self.debug = false;
	self.helpers_folder = "helpers";
	self.models_folder = "models";
	self.api_folder = "api";
	self.assets_folder = "assets";
	self.views_folder = "views";
	self.root = "../../../";

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
			return (helpers[name] = require(path)());
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
			case "validator":
			case "mongo":
				return get_helper(name, "./helpers/" + name);
				break;
			default:
				return get_helper(name, self.root + self.helpers_folder + "/" + name);
		}
	}

	self.assets = function(folder, callback, type) {
		router.route_folder(folder, self.assets_folder + "/" + folder, true, callback, type);
	}

	self.model = function(name) {
		get_model(name, self.root + self.models_folder + "/" + name);
	}

	self.view = function(url, file, callback) {
		router.route(url, self.views_folder + "/" + file, true, callback, "html");
	}

	self.mongo = function() {
		return mongo;
	}

	return self;
}
