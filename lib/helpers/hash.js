/**
 * This class contains function helping with hashing and encrypting.
 * @module Hash
 */
var hash = function(jnode) {
	var self = {};

	var crypto = require("crypto");
	var node_rsa = require('node-rsa');
	var promise = require("../utils/promise");
	var private_key = null;
	var public_key = null;
	var generateKeys = function() {

	}

	if(jnode.encryption) {
		generateKeys();
	}

	/**
	 * This is the public key of the server. When send to the client, the client can use it to encrypt
	 * messages that only the server can decrypt.
	 * @constant server_public
	 */
	self.server_public = null;

	/**
	 * This function will generate a key pair async, so it wont take up a lot of extra time. It will
	 * take about 20 seconds for the keys to be generated.
	 * @param  {Number} [private_size]      The size of the private key
	 * @param  {Number} [public_size]       The size of the public key
	 * @param  {String} [encryption_format] The format of the keys
	 * @return {Promise}                    Will return a promise
	 */
	self.generateKeys = function(private_size, public_size, encryption_format) {
		private_size = private_size || 65537;
		public_size = public_size || 2048;
		encryption_format = encryption_format || "pkcs1";
		return new promise(function(succes, failure) {
			if(private_key == null || public_key == null) {
				process.nextTick(function() {
					var key = new NodeRSA();
					key.generateKeyPair(encryption_public_size, encryption_private_size);
					private_key = key.exportKey(encryption_format + '-private-pem');
					public_key = key.exportKey(encryption_format + '-public-pem');
					self.server_public = public_key;
					succes(public_key);
				});
			}
			else {
				succes(public_key);
			}
		});
	}

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

	/**
	 * This function will encrypt data using the public key the server got from the client.
	 * @param  {String} data The message to encrypt
	 * @param  {String} key  The client key
	 * @return {String}      The encrypted data
	 * @function client_encrypt
	 */
	self.client_encrypt = function(data, key) {
		return crypto.publicEncrypt({
			key: self.client_public,
			padding: crypto.constants.RSA_PKCS1_PADDING
		}, Buffer.from(data)).toString('base64');
	}

	/**
	 * This function will decrypt data the server got from the client using the private key.
	 * @param  {String} data The data to decrypt
	 * @return {String}      The decrypted message
	 * @function client_decrypt
	 */
	self.client_decrypt = function(data) {
		return crypto.privateDecrypt({
			key: private_key,
			padding: crypto.constants.RSA_PKCS1_PADDING
		}, Buffer.from(data, "base64")).toString("utf8");
	}

	return self;
}

module.exports = hash;
