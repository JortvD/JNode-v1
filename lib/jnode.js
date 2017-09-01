/**
 * This is the main class. It should not be directly instantiated, instead use require('jnode').
 * This class will contain all the general functions and will be the starting point for using the
 * framework.
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

	/**
	 * @ignore
	 */
	self.app = app;

	/**
	 * This is the debugging setting. If turned on, the logger will also log the debug messages.
	 * The JNode Framework will start logging events, etc.
	 * @type {Boolean}
	 * @default
	 */
	self.debug = false;

	/**
	 * If compression may be use if the client requests it.
	 * @type {Boolean}
	 * @default
	 */
	self.gzip = true;

	/**
	 * The folder that contains all of your helpers.
	 * @type {String}
	 * @default
	 */
	self.helpers_folder = "helpers";

	/**
	 * The folder that contains all of your models.
	 * @type {String}
	 * @default
	 */
	self.models_folder = "models";

	/**
	 * The folder that the logger will use to store it's logs.
	 * @type {String}
	 * @default
	 */
	self.logs_folder = "logs";

	/**
	 * The folder that contains your API controllers.
	 * @type {String}
	 * @default
	 */
	self.api_folder = "api";

	/**
	 * The folder that will contain all of your assets.
	 * @type {String}
	 * @default
	 */
	self.assets_folder = "assets";

	/**
	 * The folder that will contain all your views.
	 * @type {String}
	 * @default
	 */
	self.views_folder = "views";

	/**
	 * The URL that will be used as prefix to your API url.
	 * @type {String}
	 * @default
	 */
	self.api_url = "api";

	/**
	 * The path to the root of your project.
	 * @type {String}
	 * @default
	 */
	self.root = "../../../";

	/**
	 * The port that the server will listen to.
	 * @type {Number}
	 * @default
	 */
	self.port = 80;

	/**
	 * The secret key express-session will use for encrypting cookies.
	 * @type {String}
	 * @default
	 */
	self.secret = generate_string(32);

	/**
	 * This function will start the server. Please load and initialize everything before this.
	 * @return {Promise} Will return a promise
	 */
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

	/**
	 * This function will stop the server from listening to incoming requests.
	 * @return {Promise} Will return a promise
	 */
	self.stop = function() {
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

	/**
	 * This function will return the API class. You can use the API class to route API controllers.
	 * @return {API} The API class
	 */
	self.api = function() {
		return api;
	}

	/**
	 * This function will return the database class. The database class is an abstract layer for
	 * serving data from databases.
	 * @return {Database} The database class
	 */
	self.database = function() {
		return database;
	}

	/**
	 * This function will return the socket class. The socket class can be used for controlling
	 * WebSockets (using socket.io).
	 * @return {Socket} The socket class
	 */
	self.socket = function() {
		return socket;
	}

	/**
	 * This function will return a cached library and can be used for easily accesing libraries.
	 * Library is a synonym for module.
	 * @param  {String} name The name of the library you need
	 * @return {Class}       The cached library
	 */
	self.library = function(name) {
		for(var key in libraries) {
			if(key == name) {
				return libraries[key];
			}
		}

		return (libraries[name] = require(name));
	}

	/**
	 * This function will return the specified helper. Before using the helpers folder you specified
	 * it will look for jnode's own helpers.
	 * @param  {String} name The name of the helper you need
	 * @return {Class}       The requested helper
	 */
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

	/**
	 * This function will cache the files in the specified folder and route using their path.
	 * @param  {String} folder The folder to cache and route
	 * @param  {String} [type] The type of files that are in the folder (e.g. css)
	 * @return {Promise}       Will return a promise
	 */
	self.assets = function(folder, type) {
		return router.route_folder(folder, self.root + self.assets_folder + "/" + folder, type);
	}

	/**
	 * This function will return the specified model. Use this function since it will cache the model
	 * and will make the model easily accesible.
	 * @param  {String} name The name of the model
	 * @return {Class}       The requested model
	 */
	self.model = function(name) {
		get_model(name, self.root + self.models_folder + "/" + name);
	}

	/**
	 * This function will route the specified .html file to the specified url.
	 * @param  {String} url  The URL that the file will be routed to
	 * @param  {String} file The filename of the .html file in the views folder
	 * @return {Promise}     Will return a promise
	 */
	self.view = function(url, file) {
		return router.route(url, self.root + self.views_folder + "/" + file, "html");
	}

	return self;
}

module.exports = JNode;
