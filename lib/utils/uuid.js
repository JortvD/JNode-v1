/**
 * This class will do the ID generation for you. It will generate a random UUID that is checked for
 * unicity.
 * @module UUID
 */
var uuid = function() {
	var self = {};

	var generate_uuid = function() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
	}

	/**
	 * A list of all the UUIDs.
	 * @constant uuids
	 */
	self.uuids = {};

	/**
	 * This function will generate a new UUID. If the generated UUID was already used, it will generate
	 * a new one.
	 * @return {UUID} The generated UUID
	 * @function generate
	 */
	self.generate = function() {
		var uuid = generate_uuid();

		for(var key in uuids) {
			if(uuids[key] == uuid) {
				return self.generate();
			}
		}

		return uuid;
	}

	/**
	 * This function will check if the provided UUID was already used.
	 * @param  {String}  uuid The UUID to check
	 * @return {Boolean}      If the privided UUIF was already used
	 */
	self.check = function(uuid) {
		for(var key in uuids) {
			if(uuids[key] == uuid) {
				return false;
			}
		}

		return true;
	}

	return self;
}

module.exports = uuid;
