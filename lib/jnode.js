/**
 * This is the main class. It should not be directly instantiated, instead use require('jnode').
 * This class will contain all the general functions and will be the starting point for using the
 * framework.
 * @module JNode
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
	var scheduler = require("./schedule/scheduler")();
	var zlib = require('zlib');
	var server = null;
	var models = {};
	var helpers = {};
	var libraries = {};
	var not_found = null;
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

	/**
	 * This is the debugging setting. If turned on, the logger will also log the debug messages.
	 * The JNode Framework will start logging events, etc.
	 * @constant debug
	 */
	self.debug = false;

	/**
	 * If compression may be use if the client requests it.
	 * @constant gzip
	 */
	self.gzip = true;

	/**
	 * The folder that contains all of your helpers.
	 * @constant helpers_folder
	 */
	self.helpers_folder = "helpers";

	/**
	 * The folder that contains all of your models.
	 * @constant models_folder
	 */
	self.models_folder = "models";

	/**
	 * The folder that the logger will use to store it's logs.
	 * @constant logs_folder
	 */
	self.logs_folder = "logs";

	/**
	 * The folder that contains your API controllers.
	 * @constant api_folder
	 */
	self.api_folder = "api";

	/**
	 * The folder that contains your policies.
	 * @constant policies_folder
	 */
	self.policies_folder = "policies";

	/**
	 * The folder that will contain all of your assets.
	 * @constant assets_folder
	 */
	self.assets_folder = "assets";

	/**
	 * The folder that will contain all your views.
	 * @constant views_folder
	 */
	self.views_folder = "views";

	/**
	 * The URL that will be used as prefix to your API url.
	 * @constant api_url
	 */
	self.api_url = "api";

	/**
	 * The path to the root of your project.
	 * @constant root
	 */
	self.root = "../../../";

	/**
	 * The port that the server will listen to.
	 * @constant port
	 */
	self.port = 80;

	/**
	 * The secret key express-session will use for encrypting cookies.
	 * @constant session_secret
	 */
	self.session_secret = generate_string(32);

	/**
	 * If the HttpOnly Set-Cookie attribute will be set for the session cookies. The default is true.
	 * @constant session_http_only
	 */
	self.session_http_only = true;

	/**
	 * The maximum age of a session cookie, in milliseconds. The default is -1, which means forever.
	 * @constant session_max_age
	 */
	self.session_max_age = -1;

	/**
	 * The value for the Path Set-Cookie attribute when using session cookies. The default is "/",
	 * which is the root of the domain.
	 * @constant session_path
	 */
	self.session_path = "/";

	/**
	 * Specifies if the session cookie can only be used for this site. The default is true.
	 * @constant session_same_site
	 */
	self.session_same_site = true;

	/**
	 * Specifies if the client can only send the session cookie back with an HTTPS connection. The
	 * default is false.
	 * @constant session_secure
	 */
	self.session_secure = false;

	/**
	 * The name for the session cookies. The default is "connect.sid".
	 * @constant session_name
	 */
	self.session_name = "connect.sid";

	/**
	 * If express-session will allow proxys for sessions. Default is undefined, which means it will
	 * use the express setting.
	 * @constant session_proxy
	 */
	self.session_proxy = undefined;

	/**
	 * If the sessions will be saved to the session store, even though it wasn't modified. The default
	 * is false.
	 * @constant session_resave
	 */
	self.session_resave = false;

	/**
	 * If the session cookie is forced to be send on every response. The default is false.
	 * @constant session_rolling
	 */
	self.session_rolling = false;

	/**
	 * If new sessions should be immediatly saved to the session store. The default is false.
	 * @constant session_safe_uninitialized
	 */
	self.session_safe_uninitialized = false;

	/**
	 * The result of setting req.session to null. The default is "keep".
	 * @constant session_unset
	 */
	self.session_unset = "keep";

	/**
	 * The chunk size of the compression. The default is zlib.Z_DEFAULT_CHUNK or 16384.
	 * @constant compression_chunk_size
	 */
	self.compression_chunk_size = zlib.Z_DEFAULT_CHUNK;

	/**
	 * The level of compression to use. A higher compression level will better, but slower. The
	 * default is zli.Z_DEFAULT_COMPRESSION or -1.
	 * @constant compression_level
	 */
	self.compression_level = zlib.Z_DEFAULT_COMPRESSION;

	/**
	 * How much memory may be used for compression. The default is zlib.Z_DEFAULT_MEMLEVEL or 8.
	 * @constant compression_mem_level
	 */
	self.compression_mem_level = zlib.Z_DEFAULT_MEMLEVEL;

	/**
	 * This is used to tune the compression algorithm. This will only affect the compression ratio.
	 * The default is zlib.Z_DEFAULT_STRATEGY.
	 * @constant compression_strategy
	 */
	self.compression_strategy = zlib.Z_DEFAULT_STRATEGY;

	/**
	 * The amount of bytes for the threshold. A response under this threshold won't be compressed. The
	 * default amount is 1000, which means 1kb.
	 * @constant compression_threshold
	 */
	self.compression_threshold = 1000;

	/**
	 * The amount of window bits to use. The default is zlib.Z_DEFAULT_WINDOWBITS or 15.
	 * @constant compression_window_bits
	 */
	self.compression_window_bits = zlib.Z_DEFAULT_WINDOWBITS;

	self.gc_expose = false;
	self.gc_max_new_space = 0;
	self.gc_max_old_space = 0;
	self.gc_execuatble_space = 0;
	self.gc_global = false;
	self.gc_interval = -1;
	self.gc_collect_maps = true;
	self.gc_flush_code = true;
	self.gc_use_ic = true;
	self.gc_idle_notififcation = true;
	self.gc_always_compact = false;
	self.gc_lazy_sweeping = true;
	self.gc_never_compact = false;
	self.gc_compact_code_space = true;
	self.gc_incremental_code_compaction = true;
	self.gc_cleanup_code_caches_at_gc = true;

	/**
	 * This function will start the server. Please load and initialize everything before this.
	 * @return {Promise} Will return a promise
	 * @function start
	 */
	self.start = function() {
		return new promise(function(t, c) {

			if(self.gzip) {
				app.use(compression({
					chunkSize: self.compression_chunk_size,
					level: self.compression_level,
					memLevel: self.compression_mem_level,
					strategy: self.compression_strategy,
					threshold: self.compression_threshold,
					windowBits: self.compression_window_bits
				}));
			}

			app.use(session({
				secret: self.session_secret,
				cookie: {
					httpOnly: self.session_http_only,
					maxAge: self.session_max_age,
					path: self.session_path,
					sameSite: self.session_same_site,
					secure: self.session_secure
				},
				resave: self.session_resave,
				name: self.session_name,
				rolling: self.session_rolling,
				unset: self.session_unset,
				saveUninitialized: self.session_safe_uninitialized
			}));

			if(not_found != null) {
				app.use("*", function(req, res) {
					not_found(req, res);
				});
			}

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
	 * @function stop
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
	 * @function api
	 */
	self.api = function() {
		return api;
	}



	/**
	 * This function will return the scheduler class. With the scheduler you can schedule jobs to do
	 * things on specified times.
	 * @return {Scheduler} The scheduler class
	 * @function scheduler
	 */
	self.scheduler = function() {
		return scheduler;
	}

	/**
	 * This function will return the database class. The database class is an abstract layer for
	 * serving data from databases.
	 * @return {Database} The database class
	 * @function database
	 */
	self.database = function() {
		return database;
	}

	/**
	 * This function will return the socket class. The socket class can be used for controlling
	 * WebSockets (using socket.io).
	 * @return {Socket} The socket class
	 * @function socket
	 */
	self.socket = function() {
		return socket;
	}

	/**
	 * This function will return a cached library and can be used for easily accesing libraries.
	 * Library is a synonym for module.
	 * @param  {String} name The name of the library you need
	 * @return {Class}       The cached library
	 * @function library
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
	 * @function helper
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
	 * @function assets
	 */
	self.assets = function(folder, type) {
		return router.route_folder(folder, self.root + self.assets_folder + "/" + folder, type);
	}

	/**
	 * This function will return the specified model. Use this function since it will cache the model
	 * and will make the model easily accesible.
	 * @param  {String} name The name of the model
	 * @return {Class}       The requested model
	 * @function model
	 */
	self.model = function(name) {
		get_model(name, self.root + self.models_folder + "/" + name);
	}

	/**
	 * This function will route the specified .html file to the specified url.
	 * @param  {String} url  The URL that the file will be routed to
	 * @param  {String} file The filename of the .html file in the views folder
	 * @return {Promise}     Will return a promise
	 * @function view
	 */
	self.view = function(url, file) {
		return router.route(url, self.root + self.views_folder + "/" + file, "html");
	}

	/**
	 * This function will call back the callback when the requested url was not found. AKA on a 404
	 * error.
	 * @param  {Function} callback The callback that will be called back
	 * @function not_found
	 */
	self.not_found = function(callback) {
		not_found = callback;
	}

	/**
	 * Redirects the user to the new URL when requesting the orginal URL. You can also provide a
	 * status to go with it.
	 * @param  {String} original_url The URL to redirect from
	 * @param  {String} new_url      The URL to redirect to
	 * @param  {Number} [status]     The optional status to send with the redirect
	 * @function redirect
	 */
	self.redirect = function(original_url, new_url, status) {
		status = status || 300;

		app.route(original_url, function(req, res) {
			res.redirect(status, new_url);
		});
	}

	return self;
}

module.exports = JNode;
