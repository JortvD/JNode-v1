/**
 * This is the client class. With this class you can individually manage clients.
 * @module Client
 */
var client = function(socket) {
	var self = {};

	/**
	 * The id of this client.
	 * @constant id
	 */
	self.id = socket.id;

	/**
	 * The address that the client used to connect with.
	 * @constant address
	 */
	self.address = socket.address.address;

	/**
	 * The headers the client used to connect.
	 * @constant headers
	 */
	self.headers = socket.headers;

	/**
	 * If the connection with the client is secure.
	 * @constant secure
	 */
	self.secure = socket.secure;

	/**
	 * If the client connected from a different domain.
	 * @constant xdomain
	 */
	self.xdomain = socket.xdomain;

	/**
	 * This function will emit the specified event to the client.
	 * @param  {String}    event The event to emit
	 * @param  {Arguments} args  The arguments to go with it
	 * @function emit
	 */
	self.emit = function(event, ...args) {
		socket.emit(event, args);
	}

	/**
	 * This function will setup a listener for the specified event. If the client send the specified
	 * event this listener will be called.
	 * @param  {String} event The event to listen for
	 * @return {Promise}      Will return a promise
	 * @function on
	 */
	self.on = function(event) {
		return new promise(function(succes, failure) {
			socket.on(event, function(...args) {
				succes(args);
			}
		});
	}

	/**
	 * This function will make the client join the specfied room.
	 * @param  {String} room The room to join
	 * @return {Promise}     Will return a promise
	 * @function join
	 */
	self.join = function(room) {
		return new promise(function(succes, failure) {
			socket.join(room, function() {
				succes();
			});
		});
	}

	/**
	 * This function will make the client leave the specified room.
	 * @param  {String} room The room to leave
	 * @return {Prmoise}     Will return a promise
	 * @function leave
	 */
	self.leave = function(room) {
		return new promise(function(succes, failure) {
			socket.leave(room, function() {
				succes();
			});
		});
	}

	/**
	 * This function will return the same client in the specified room. Use this function to easily
	 * emit an event in another room without having to join and leave it.
	 * @param  {String} room The room to go in
	 * @return {Client}      The client to use
	 * @function to
	 */
	self.to = function(room) {
		return new client(socket.to(room));
	}

	/**
	 * This function will add middleware to this client.
	 * @return {Promise} Will return a promise
	 * @function use
	 */
	self.use = function() {
		return new promise(function(succes, failure) {
			namespace.use(function(packet) {
				succes(packet);
			});
		});
	}

	/**
	 * This function will disconnect the user from the server.
	 * @function disconnect
	 */
	self.disconnect = function() {
		socket.disconnect(true);
	}

	return self;
}

module.exports = client;
