/**
 * The JNode main class
 * @class
 */
var JNode = function() {
	var self = {};

	var express = require('express');
	var compression = require('compression');
	var app = express();
	var session = require('express-session');
	var router = require('./routing/router')(self);
	var api = require('./api/api')(self);
	var database = require('./db/database')();
	var socket = require('./socket/socket');
	var promise = require("./utils/promise");
	var server = null;
	var models = {};
	var helpers = {};
	var libraries = {};
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

	self.app = app;
	self.debug = false;
	self.gzip = true;
	self.helpers_folder = "helpers";
	self.models_folder = "models";
	self.logs_folder = "logs";
	self.api_folder = "api";
	self.assets_folder = "assets";
	self.views_folder = "views";
	self.api_url = "api";
	self.root = "../../../";
	self.port = 3000;
	self.secret = generate_string(32);

	self.start = function() {
		return new promise(function(t, c) {

			if(self.gzip) {
				app.use(compression());
			}

			app.use(session({
				secret: self.secret,
				resave: false,
				saveUninitialized: true
			}));

			server = app.listen(self.port, function(err) {
				if(err) {
					c(err);
				}

				self.helper("logger").debug("Started listening on port " + self.port + ".");

				t();
			});
		});
	}

	self.stop = function(callback) {
		return new promise(function(t, c) {
			server.close(function(err) {
				if(err) {
					c(err);
				}

				self.helper("logger").debug("Stopped listening on port " + self.port + ".");

				t();
			});
		});
	}

	self.api = function() {
		return api;
	}

	self.database = function() {
		return database;
	}

	self.socket = function() {
		return socket;
	}

	self.library = function(name) {
		for(var key in libraries) {
			if(key == name) {
				return libraries[key];
			}
		}

		return (libraries[name] = require(name));
	}

	self.helper = function(name) {
		switch(name) {
			case "validator":
			case "logger":
			case "hash":
				return get_helper(name, "./helpers/" + name);
				break;
			default:
				return get_helper(name, self.root + self.helpers_folder + "/" + name);
		}
	}

	self.assets = function(folder, type) {
		return router.route_folder(folder, self.root + self.assets_folder + "/" + folder, type);
	}

	self.model = function(name) {
		get_model(name, self.root + self.models_folder + "/" + name);
	}

	self.view = function(url, file) {
		return router.route(url, self.root + self.views_folder + "/" + file, "html");
	}

	return self;
}

module.exports = JNode;
