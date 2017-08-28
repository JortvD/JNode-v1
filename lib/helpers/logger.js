module.exports = function(jnode) {
	var self = {};

	self.info = function(msg) {
		self.print(msg, "INFO");
	}

	self.warn = function(msg) {
		if(jnode.debug) {
			self.print(msg, "WARN");
		}
	}

	self.error = function(msg) {
		self.print(msg, "ERROR");
	}

	self.debug = function(msg) {
		if(jnode.debug) {
			self.print(msg, "DEBUG");
		}
	}

	self.print = function(msg, tag, time) {
		var d = new Date();

		tag = tag || "INFO";
		time = time || d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();

		console.log("[" + tag + "][" + time + "]: " + msg);
	}

	return self;
}
