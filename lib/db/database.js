/**
 * This class is an abstract layer for accesing a database. When using this class, the class will
 * throughput your actions to selected driver.
 * @module database
 */
var database = function() {
	var self = {};

	var driver = require("./mongo")();

	/**
	 * This function will select a driver.
	 * @param  {String} name The name of the driver to select
	 * @function driver
	 */
	self.driver = function(name) {
		self.close();

		switch(name) {
			case "mongo":
				driver = require("./mongo")();
				break;
		}
	}

	/**
	 * This function will connect you to the database.
	 * @param  {String} domain   The domain to connect to
	 * @param  {String} username The username of the database
	 * @param  {String} password The password of the database
	 * @param  {Number} port     The port to connect to
	 * @return {Promise}         Will return a promise
	 * @function connect
	 */
	self.connect = function(domain, username, password, port) {
		return driver.connect(domain, username, password, port);
	}

	/**
	 * This function will close the currently open database.
	 * @return {Promise} Will return a promise
	 * @function close
	 */
	self.close = function() {
		return driver.close();
	}

	/**
	 * This function will select a different database.
	 * @param  {String} name The name of the database to select
	 * @return {Promise}     Will return a promise
	 * @function database_select
	 */
	self.database_select = function(name) {
		return driver.database_select(name);
	}

	/**
	 * This function will create a new database.
	 * @param  {String} name The name of the database to create
	 * @return {Promise}     Will return a promise
	 * @function database_create
	 */
	self.database_create = function(name) {
		return driver.database_create(name);
	}

	/**
	 * This function will drop the specified database.
	 * @param  {String} name The name of the database to drop
	 * @return {Promise}     Will return a promise
	 * @function database_drop
	 */
	self.database_drop = function(name) {
		return driver.database_drop(name);
	}

	/**
	 * This function will select a different table.
	 * @param  {String} name The table to select
	 * @return {Promise}     Will return a promise
	 * @function table_select
	 */
	self.table_select = function(name) {
		return driver.table_select(name);
	}

	/**
	 * This function will create a new table.
	 * @param  {String} name The table to create
	 * @return {Promise}     Will return a promise
	 * @function table_create
	 */
	self.table_create = function(name) {
		return driver.table_create(name);
	}

	/**
	 * This function will drop the specied table
	 * @param  {String} name The table to drop
	 * @return {Promise}     Will return a promise
	 * @function table_drop
	 */
	self.table_drop = function(name) {
		return driver.table_drop(name);
	}

	/**
	 * This function will clear the current table.
	 * @return {Promise} Will return a promise
	 * @function table_clear
	 */
	self.table_clear = function() {
		return driver.table_clear();
	}

	/**
	 * This function will make a column and return it.
	 * @param  {String} name     The column name
	 * @param  {String} datatype The datatype of the column
	 * @param  {Object} options  Extra options for the column
	 * @return {String}          The build column
	 * @function column_make
	 */
	self.column_make = function(name, datatype, options) {
		return driver.column_make(name, datatype, options);
	}

	/**
	 * This function will add a new column to the column list.
	 * @param  {String} column The column to add
	 * @return {Promise}       Will return a promise
	 * @function column_add
	 */
	self.column_add = function(column) {
		return driver.column_add(column);
	}

	/**
	 * This function will drop a column.
	 * @param  {String} name The name of the column
	 * @return {Promise}     Will return a promise
	 * @function column_drop
	 */
	self.column_drop = function(name) {
		return driver.column_drop(column);
	}

	/**
	 * This function will modify a column.
	 * @param  {String} name   The name of the original column
	 * @param  {String} column The new column
	 * @return {Promise}       Will return a promise
	 * @function column_modify
	 */
	self.column_modify = function(name, column) {
		return driver.column_modify(name, column);
	}

	/**
	 * This function will create a new primary key.
	 * @param  {String} keys The key to create
	 * @return {Promise}     Will return a promise
	 * @function primary_key_create
	 */
	self.primary_key_create = function(keys) {
		return driver.primary_key_create(keys);
	}

	/**
	 * This function will drop the primary key.
	 * @return {Promise} Will return a promise
	 * @function primary_key_drop
	 */
	self.primary_key_drop = function() {
		return driver.primary_key_drop();
	}

	/**
	 * This function will create a new secondary key.
	 * @param  {String} keys        The secondary key to create
	 * @param  {String} other_table The name of the other table
	 * @param  {String} other_keys  The name of the other primary key
	 * @return {Promise}            Will return a promise
	 * @function secondary_key_create
	 */
	self.secondary_key_create = function(keys, other_table, other_keys) {
		return driver.secondary_key_create(keys, other_table, other_keys);
	}

	/**
	 * This function will insert the specified row into the table.
	 * @param  {Object} row The row to insert
	 * @return {Promise}    Will return a promise
	 * @function insert
	 */
	self.insert = function(row) {
		return driver.insert(row);
	}

	/**
	 * This function will modify the specified row.
	 * @param  {Object} query  The query for the specified object
	 * @param  {Object} update The updates (e.g. {"column1":"new"})
	 * @return {Promise}       Will return a promise
	 * @function modify
	 */
	self.modify = function(query, update) {
		return driver.modify(query, update);
	}

	/**
	 * This function will delete the specified row.
	 * @param  {Object} query The query for the specified object
	 * @return {Promise}      Will return a promise
	 * @function delete
	 */
	self.delete = function(query) {
		return driver.delete(query);
	}

	/**
	 * This function will return the queried rows.
	 * @param  {String} query The query to select rows
	 * @return {List}         The list of queried rows
	 * @function find
	 */
	self.find = function(query) {
		return driver.find(query);
	}

	return self;
}

module.exports = database;
