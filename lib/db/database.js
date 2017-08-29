module.exports = function() {
	var self = {};

	var driver = require("./mongo");

	self.driver = function(name) {
		switch(name) {
			case "mongo":
				driver = require("./mongo");
				break;
		}
	}

	retunr self;
}
