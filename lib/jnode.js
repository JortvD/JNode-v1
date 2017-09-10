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
	var helmet = require('helmet');
	var cookieParser = require('cookie-parser');
	var csrf = require('csurf');
	var bodyParser = require('body-parser');
	var engines = require("consolidate");
	var zlib = require('zlib');
	var v8 = require('v8');
	var ddos = require('ddos');
	var server = null;
	var models = {};
	var helpers = {};
	var libraries = {};
	var not_found = null;
	var flags = {};
	var locales = {};
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
	var add_flag = function(flag, value) {
		flags[flag] = value;
	}
	var set_flags = function() {
		var flags_string = "";

		for(var key in flags) {
			flags_string += "--" + key + " " + flags[key] + " ";
		}

		v8.setFlagsFromString(flags_string);
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
	 * The folder that contains all of your language files.
	 * @constant locales_folder
	 */
	self.locales_folder = "locales";

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
	self.root = process.env.PWD + "/";

	/**
	 * The port that the server will listen to.
	 * @constant port
	 */
	self.port = 80;

	/**
	 * If the logger should log to a file.
	 * @constant log_to_file
	 */
	self.log_to_file = true;

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

	/**
	 * The maximum of Mbytes used for the old generation. The default is 0.
	 * @constant gc_max_old_space
	 */
	self.gc_max_old_space = 0;

	/**
	 * If garbage collection should always be global. The default is true.
	 * @constant gc_global
	 */
	self.gc_global = false;

	/**
	 * The interval of allocations per garbage collection. The default is -1, which means it will gc
	 * when needed.
	 * @constant gc_interval
	 */
	self.gc_interval = -1;

	/**
	 * Flush code that isn't expected to be used again during garbage collection. The default is true.
	 * @constant gc_flush_code
	 */
	self.gc_flush_code = true;

	/**
	 * If NodeJS should use inline catching. The default is set to true.
	 * @constant gc_use_ic
	 */
	self.gc_use_ic = true;

	/**
	 * If idle notifications should be used to recude memory footprints. The default is true.
	 * @constant gc_use_idle_notification
	 */
	self.gc_use_idle_notification = true;

	/**
	 * If compaction should be performed on every full garbage collection. The default is set to false.
	 * @constant gc_always_compact
	 */
	self.gc_always_compact = false;

	/**
	 * If lazy sweeping should be used for old pointers and data space. The default is true.
	 * @constant gc_lazy_sweeping
	 */
	self.gc_lazy_sweeping = true;

	/**
	 * If compact code space should be used on full non-incremental collections. The default is true.
	 * @constant gc_compact_code_space
	 */
	self.gc_compact_code_space = true;

	/**
	 * Flush inline caches prior to mark compact collection and flush code caches in maps during mark
	 * compact cycle. The defualt is true.
	 * @constant gc_cleanup_code_caches_at_gc
	 */
	self.gc_cleanup_code_caches_at_gc = true;

	/**
	 * If the experimental extras should be used. The default is false.
	 * @constant experimental_extras
	 */
	self.experimental_extras = false;

	/**
	 * If strict should always be used. The default is set to false.
	 * @constant use_strict
	 */
	self.use_strict = false;

	/**
	 * If the memory reducer should be used. The default is true.
	 * @constant memory_reducer
	 */
	self.memory_reducer = true;

	/**
	 * The content security policy contains the URLs that the client can use for getting data. Please
	 * look at <a href="https://helmetjs.github.io/docs/csp/">this</a> page for more information about
	 * CSP. The default is null, which means everything is allowed.
	 * @constant content_security_policy
	 */
	self.content_security_policy = null;

	/**
	 * Before loading a page the browser will fetch the page URL. An attacker could load something
	 * after fetching the URL. When turning dns_prefetch_control to false it will say to the browser
	 * to check the URL after loading the page. The default is false.
	 * @constant dns_prefetch_control
	 */
	self.dns_prefetch_control = false;

	/**
	 * Frameguard prevents clickjacking attacks. Use the frameguard setting to say whether the site
	 * can be displayed in an IFrame. The default is sameorigin, which means it can only be in iframes
	 * that are loaded from the same server.
	 * @constant frameguard
	 */
	self.frameguard = "sameorigin";

	/**
	 * If hide_powered_by is turned on you can use this settings to change the name to this specified
	 * name. The default name is "JNode".
	 * @constant powered_by_name
	 */
	self.powered_by_name = "JNode";

	/**
	 * If the powered by header should be removed. A hacker could use this information to their
	 * advantage. If powered_by_name is not set to null it will show that name instead. The default is
	 * set to true.
	 * @constant hide_powered_by
	 */
	self.hide_powered_by = true;

	/**
	 * This will tell the browser to only use HTTPS for the coming time (Specified with hsts_time).
	 * The default is set to false to also support HTTP.
	 * @constant hsts
	 */
	self.hsts = false;

	/**
	 * The time the browser should use HTTPS before checking again. The default is 60 days. Note that
	 * the specified time has to be in seconds.
	 * @constant hsts_time
	 */
	self.hsts_time = 5184000;

	/**
	 * This settings will stop old IE browsers from executing in their context. The default is true.
	 * @constant ie_no_open
	 */
	self.ie_no_open = true;

	/**
	 * If the browser isn't allowed to cache file. The default is false, so the loading times will be
	 * faster.
	 * @constant no_cache
	 */
	self.no_cache = false;

	/**
	 * With the no_sniff setting the server sends headers to prevent to user from sniffing files.
	 * Sniffing files can cause malicious files to be run. The defualt is set to true.
	 * @constant no_sniff
	 */
	self.no_sniff = true;

	/**
	 * The referrer_policy setting can block browsers that came from different websites. The default
	 * is nu, which means everything is allowed.
	 * @constant referrer_policy
	 */
	self.referrer_policy = null;

	/**
	 * The XSS filter will check parameters before passing them through. This will prevent a lot of
	 * possible XSS attacks, but not all. The default is true.
	 * @constant xss_filter
	 */
	self.xss_filter = true;

	/**
	 * If CSRF protection should be enabled. This protects users from session riding. The default is
	 * true.
	 * @constant csrf
	 */
	self.csrf = true;

	/**
	 * If the DDOS protection should be turned on. DDOSing is rapidly sending requests to the server
	 * so it will crash. Please note that it would be better to use a seperate DDOS protection server.
	 * By default this will be turned on.
	 * @constant ddos
	 */
	self.ddos = false;

	/**
	 * When there are more request per interval than this count, it will be set back to the max count
	 * to reduce the punishment building up. The default value is 100.
	 * @constant ddos_max_count
	 */
	self.ddos_max_count = 100;

	/**
	 * The amount of requests per interval before the server will start punishing the client by
	 * slowing down their request. The default is 40.
	 * @constant ddos_burst
	 */
	self.ddos_burst = 40;

	/**
	 * The amount of request per interval before the server will stop the requests. The default is 80.
	 * @constant ddos_limit
	 */
	self.ddos_limit = 80;

	/**
	 * The amount of seconds in an interval. The default value is 100 seconds.
	 * @constant ddos_max_expiry
	 */
	self.ddos_max_expiry = 100;

	/**
	 * The amount of seconds before updating the ddos table. The default is 1 second.
	 * @constant ddos_check_interval
	 */
	self.ddos_check_interval = 1;

	/**
	 * When true, the clients user-agent will be also used to identify the unique user. The default is
	 * true.
	 * @constant ddos_include_user_agent
	 */
	self.ddos_include_user_agent = true;

	/**
	 * The list of IPs that will be whitelisted for the DDOS protection. By default, there are no IPs
	 * selected.
	 * @constant ddos_whitelist
	 */
	self.ddos_whitelist = [];

	/**
	 * If the DDOS protection should be in silent mode. By default this is false.
	 * @constant ddos_silent
	 */
	self.ddos_silent = false;

	/**
	 * The message that will be send with the response code when the limit of request is reached. The
	 * default message is "Too Many Requests".
	 * @constant ddos_error_message
	 */
	self.ddos_error_message = "Too Many Requests";

	/**
	 * The response code that will be send when the limit of requests is reached. The default code is
	 * 429.
	 * @constant ddos_response_code
	 */
	self.ddos_response_code = 429;

	/**
	 * The path to which all socket stuff wil be routed. Default is "/socket.io".
	 * @constant socket_path
	 */
	self.socket_path = "/socket.io";

	/**
	 * If the server can serve the client files over sockets. By default it is set to true.
	 * @constant socket_serve_files
	 */
	self.socket_serve_files = true;

	/**
	 * The port to which the server will listen for sockets. The default port is 3000.
	 * @constant socket_port
	 */
	self.socket_port = 3000;

	/**
	 * This function will start the server. Please load and initialize everything before this.
	 * @return {Promise} Will return a promise
	 * @function start
	 */
	self.start = function() {
		return new promise(function(t, succes, failure) {

			add_flag("max_old_space_size", self.gc_max_old_space);
			add_flag("gc_global", self.gc_global);
			add_flag("gc_interval", self.gc_interval);
			add_flag("flush_code", self.gc_flush_code);
			add_flag("use_idle_notification", self.gc_use_idle_notification);
			add_flag("use_ic", self.gc_use_ic);
			add_flag("always_compact", self.gc_always_compact);
			add_flag("compact_code_space", self.gc_compact_code_space);
			add_flag("cleanup_code_caches_at_gc", self.gc_cleanup_code_caches_at_gc);

			add_flag("experimental_extras", self.experimental_extras);
			add_flag("use_strict", self.use_strict);
			add_flag("memory_reducer", self.memory_reducer);

			set_flags();

			if(self.content_security_policy != null) {
				app.use(helmet.contentSecurityPolicy(self.content_security_policy));
			}

			app.use(helmet.dnsPrefetchControl({allow: self.dns_prefetch_control}));

			if(self.frameguard != null) {
				app.use(helmet.frameguard({action: self.frameguard}));
			}

			if(self.hide_powered_by) {
				app.use(helmet.hidePoweredBy({setTo: self.powered_by_name}));
			}

			if(self.hsts) {
				app.use(helmet.hsts({maxAge: self.hsts_time}));
			}

			if(self.ie_no_open) {
				app.use(helmet.ieNoOpen());
			}

			if(self.no_cache) {
				app.use(helmet.noCache());
			}

			if(self.no_sniff) {
				app.use(helmet.noSniff());
			}

			if(self.referrer_policy != null) {
				app.use(helmet.reffererPolicy({policy: self.referrer_policy}));
			}

			if(self.xss_filter) {
				app.use(helmet.xssFilter());
			}

			if(self.ddos) {
				app.use(new Ddos({
					maxcount: self.ddos_max_count,
					burst: self.ddos_burst,
					limit: self.ddos_limit,
					maxexpiry: self.ddos_max_expiry,
					checkinterval: self.ddos_check_interval,
					includeUserAgent: self.ddos_include_user_agent,
					whitelist: self.ddos_whitelist,
					silent: self.ddos_silent,
					errormessage: self.ddos_error_message,
					responseStatus: self.ddos_response_code
				}));
			}

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

			if(self.csrf) {
				app.use(bodyParser.urlencoded({ extended: false }))
				app.use(cookieParser())
				app.use(csrf({ cookie: true }))
			}

			if(not_found != null) {
				app.use("*", function(req, res) {
					not_found(req, res);
				});
			}

			server = app.listen(self.port, function(err) {
				if(err) {
					failure(err);
				}

				self.helper("logger").debug("Started listening on port " + self.port + ".");

				succes();
			});
		});
	}

	/**
	 * This function will stop the server from listening to incoming requests.
	 * @return {Promise} Will return a promise
	 * @function stop
	 */
	self.stop = function() {
		return new promise(function(succes, failure) {
			server.close(function(err) {
				if(err) {
					succes(err);
				}

				self.helper("logger").debug("Stopped listening on port " + self.port + ".");

				failure();
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
	 * This function will set the favicon to the specified path. It will cache the icon so it will be
	 * able to send it faster.
	 * @param  {String}  file The path to the favicon
	 * @function favicon
	 */
	self.favicon = function(file) {
		router.route("favicon.ico", self.root + file)
		.then(function(req, res, file) {
			res.send(file.data);
		});
	}

	/**
	 * This function will set the view rendering engine. You can use all the consolidate view engines.
	 * @param  {String} engine      The engine the use
	 * @param  {String} [extension] The file extension of that engine (Will use engine as default)
	 * @function engine
	 */
	self.engine = function(engine, extension) {
		extension = extension || engine;

		app.engine(extension, engines[engine]);
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
	 * @function not_found
	 */
	self.not_found = function() {
		return new promise(function(succes, failure) {
			not_found = succes;
		});
	}

	/**
	 * This function will return a promise that will be called when there was an uncached error.
	 * @return {Promise} Will return a promise
	 * @function error
	 */
	self.error = function() {
		return new promise(function(succes, failure) {
			app.use(function (err, req, res, next) {
				failure(err, req, res);
			});
		});
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

	self.language = function(language, file) {
		var file = require(self.root + self.locales_folder + "/" + file);
		locales[language] = file;
	}

	self.locale = function(language, path) {
		var locale = locales[language];

		path = path.split(".");

		for(var i = 0; i < path.length; i++) {
			locale = locale[path[i]];
		}

		return locale;
	}

	return self;
}

module.exports = JNode;
