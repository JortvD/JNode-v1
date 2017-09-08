/**
 * This is the room class. The rooms are the part of the server that separate the traffic. Every room
 * can listen for incomming clients and broadcast messages to them. Individual management is done in
 * the client.js class.
 * @module Room
 */
var room = function(namespace) {
	var self = {};

	var promise = require("../utils/promise");
	var client = require("./client");

	/**
	 * The name of this room.
	 * @constant name
	 */
	self.name = namespace.name;

	/**
	 * This function will broadcast an event to every client in this room.
	 * @param  {String}    event The event to broadcast
	 * @param  {Arguments} args  The arguments to with it
	 * @function broadcast
	 */
	self.broadcast = function(event, ...args) {
		namespace.emit(event, args);
	}

	/**
	 * This function will add middleware to this room. This function can stop the socket from
	 * connecting since it is called before the connection event.
	 * @return {Promise} Will return a promise
	 */
	self.use = function() {
		return new promise(function(succes, failure) {
			namespace.use(function(socket) {
				succes(socket);
			});
		});
	}

	/**
	 * This function is used to listen for incoming clients. Every time a client connects the promise
	 * will get called.
	 * @return {Promise} Will return a promise
	 */
	self.listen = function() {
		return new promise(function(succes, failure) {
			socket.on("connection", function(socket) {
				succes(new client(socket));
			})
		});
	}

	return self;
}

module.exports = room;
