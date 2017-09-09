/**
 * This is the main class for controlling sockets. It will create the server and instantiate the main
 * room. The server is started automatically.
 * @module Socket
 */
var socket = function(jnode) {
	var self = {};

	var socket = require("socket.io")(jnode.socket_port, {
		path: jnode.socket_path,
		serverClient: jnode.socket_serve_files
	});
	var promise = require("../utils/promise");
	var room = require("./room");
	var _room = new room(socket);

	/**
	 * The name of the main room. See {@link Room#name}.
	 * @constant name
	 */
	self.name = _room.name;

	/**
	 * This function will broadcast a message to all the sockets. See {@link Room#broadcast()}.
	 * @function broadcast
	 */
	self.broadcast = _room.broadcast;

	/**
	 * This function will add middlewate to all the sockets. See {@link Room#use()}.
	 * @function use
	 */
	self.use = _room.use;

	/**
	 * This function will listen for all connections. See {@link Room#listen()}.
	 * @function listen
	 */
	self.listen = _room.listen;

	/**
	 * This function will return the specified room. A room is a part of the server and used to
	 * separate traffic.
	 * @param  {String} name The name of the room
	 * @return {Room}        The room
	 * @function room
	 */
	self.room = function(name) {
		return new room(socket.of(name));
	}

	/**
	 * This function will close the server. You probably never need to use this.
	 * @return {Promise} Will return a promise
	 */
	self.close = function() {
		return new promise(function(succes, failure) {
			socket.close(function() {
				succes();
			});
		});
	}

	return self;
}

module.exports = socket;
