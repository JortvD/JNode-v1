module.exports = function(jnode) {
	var self = {};

	var crypto = require("crypto");

	self.hash = function(data, algorithm) {
		algorithm = algorithm || "sha256";
		return crypto.createHash(algorithm).update(data).digest('hex');
	}

	self.encrypt = function(data, key, algorithm) {
		algorithm = algorithm || "aes256";

		var cipher = crypto.createDecipher(algorithm, key);
		return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
	}

	self.decrypt = function(data, key, algorithm) {
		algorithm = algorithm || "aes256";

		var decipher = crypto.createDecipher(algorithm, key);
		return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
	}

	return self;
}
