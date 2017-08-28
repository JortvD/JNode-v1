module.exports = function() {
	var self = {};

	var express = require('express');
	var app = express();
	var session = require('express-session');
	var router = require('./routing/router')(self);
	var api = require('./api/api')(self);
	var mongo = require('./helpers/mongo');
	var server = null;
	var models = {};
	var helpers = {};
	var generate_string = function(length) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}
	var get_helper = function(name, path) {
		if(helpers[name]) {
			return helpers[name];
		} else {
			return (helpers[name] = require(path)(self));
		}
	}
	var get_model = function(name, path) {
		if(models[name]) {
			return models[name];
		} else {
			return (models[name] = require(path));
		}
	}

	app.use(session({
		secret: generate_string(32),
		resave: false,
		saveUninitialized: true
	}));

	self.app = app;
	self.debug = false;
	self.helpers_folder = "helpers";
	self.models_folder = "models";
	self.api_folder = "api";
	self.assets_folder = "assets";
	self.views_folder = "views";
	self.root = "../../../";
	self.port = 3000;

	self.start = function(port, callback) {
		self.port = port || self.port;
		server = app.listen(self.port, function() {
			self.helper("logger").debug("Started listening on port " + self.port + ".");

			if(callback != null) {
				callback();
			}
		});
	}

	self.stop = function(callback) {
		server.close(function() {
			self.helper("logger").debug("Stopped listening on port " + self.port + ".");

			if(callback != null) {
				callback();
			}
		});
	}

	self.api = function() {
		return api;
	}

	self.helper = function(name) {
		switch(name) {
			case "validator":
			case "mongo":
			case "logger":
			case "socket":
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

	return self;
}
