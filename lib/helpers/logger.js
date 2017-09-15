/**
 * This class contains function helping you with logging errors and other events.
 * @module Logger
 */
var logger = function(jnode) {
	var self = {};

	var fs = require("fs");
	var date = new Date();
	var file = jnode.root + 
			   jnode.logs_folder + "/" +
			   date.getFullYear() + "_" +
			   date.getMonth() + "_" +
			   date.getDate() + "_" +
			   date.getHours() + "_" +
			   date.getMinutes() + "_" +
			   date.getSeconds() + ".log";
	var exists = fs.existsSync(jnode.root + jnode.logs_folder);

	/**
	 * This function will log an info message. It should be used for informational messages.
	 * @param  {String} msg The message to log
	 * @function info
	 */
	self.info = function(msg) {
		self.print(msg, "INFO");
	}

	/**
	 * This function will log a warning message. It should be used for warnings and non-important
	 * errors.
	 * @param  {String} msg The message to log
	 * @function warn
	 */
	self.warn = function(msg) {
		if(jnode.debug) {
			self.print(msg, "WARN");
		}
	}

	/**
	 * This function will log an error message. It should be used for important errors (e.g. those that
	 * will stop the server).
	 * @param  {String} msg The message to log
	 * @function error
	 */
	self.error = function(msg) {
		self.print(msg, "ERROR");
	}

	/**
	 * This function will log a debug message. Debug messages are use for debugging only and will only
	 * be shown when the debugging setting is turned on.
	 * @param  {String} msg The message to log
	 * @function debug
	 */
	self.debug = function(msg, func) {
		if(jnode.debug) {
			if(func != null) {
				self.print("[" + func + "]: " + msg, "DEBUG");
			}
			else {
				self.print(msg, "DEBUG");
			}
			
		}
	}

	/**
	 * This function will print an error to the console. You can use it to create your own errors.
	 * @param  {String} msg  The message to log
	 * @param  {String} tag  The logging tag (e.g. INFO)
	 * @param  {String} time The time the event occurred on
	 * @function print
	 */
	self.print = function(msg, tag, time) {
		var d = new Date();

		tag = tag || "INFO";
		time = time || d.getHours() + ":" +
					   d.getMinutes() + ":" +
					   d.getSeconds() + "." +
					   d.getMilliseconds();
		msg = msg || "";

		if(!msg.startsWith("[")) {
			msg = "[" + time + "][" + tag + "]: " + msg;
		}
		else {
			msg = "[" + time + "][" + tag + "]" + msg;
		}

		console.log(msg);

		if(jnode.log_to_file && exists) {
			fs.appendFile(file, msg + "\n", 'utf8', function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
	}

	return self;
}

module.exports = logger;
