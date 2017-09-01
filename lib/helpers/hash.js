/**
 * This class contains function helping with hashing and encrypting.
 * @module Hash
 */
var hash = function(jnode) {
	var self = {};

	var crypto = require("crypto");

	/**
	 * This function will hash the inserted data. You can also provide an algorthm it will use.
	 * @param  {String} data      The data to hash
	 * @param  {String} algorithm The algorithm to use
	 * @return {String}           The hashed data
	 * @function hash
	 */
	self.hash = function(data, algorithm) {
		algorithm = algorithm || "sha256";
		return crypto.createHash(algorithm).update(data).digest('hex');
	}

	/**
	 * This function will encrypt the provided data. You can encrypt it with multiple algorithms.
	 * @param  {String} data        The data to encrypt
	 * @param  {String} key         The key to use
	 * @param  {String} [algorithm] The algorithm to use
	 * @return {String}             The encrypted data
	 * @function encrypt
	 */
	self.encrypt = function(data, key, algorithm) {
		algorithm = algorithm || "aes256";

		var cipher = crypto.createCipher(algorithm, key);
		return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
	}

	/**
	 * This function will decrypt the provided data. You have to use the same algorithm that you used
	 * to encrypt it.
	 * @param  {String} data      The data to decrypt
	 * @param  {String} key       The key to use
	 * @param  {String} algorithm The algorithm to use
	 * @return {String}           The decrypted data
	 * @function decrypt
	 */
	self.decrypt = function(data, key, algorithm) {
		algorithm = algorithm || "aes256";

		var decipher = crypto.createDecipher(algorithm, key);
		return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
	}

	return self;
}

module.exports = hash;
