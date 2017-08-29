module.exports = function() {
	var self = {};

	var driver = require("./mongo")();

	self.driver = function(name) {
		self.close();

		switch(name) {
			case "mongo":
				driver = require("./mongo")();
				break;
		}
	}

	self.connect = function(username, password, port) {
		return driver.connect(username, password, port);
	}

	self.close = function() {
		return driver.close();
	}

	self.database_select = function(name) {
		return driver.database_select(name);
	}

	self.database_create = function(name) {
		return driver.database_create(name);
	}

	self.database_drop = function(name) {
		return driver.database_drop(name);
	}

	self.table_select = function(name) {
		return driver.table_select(name);
	}

	self.table_create = function(name) {
		return driver.table_create(name);
	}

	self.table_drop = function(name) {
		return driver.table_drop(name);
	}

	self.table_clear = function() {
		return driver.table_clear();
	}

	self.column_make = function(name, datatype, options) {
		return driver.column_make(name, datatype, options);
	}

	self.column_add = function(column) {
		return driver.column_add(column);
	}

	self.column_drop = function(name) {
		return driver.column_drop(column);
	}

	self.column_modify = function(name, column) {
		return driver.column_modify(name, column);
	}

	self.primary_key_create = function(keys) {
		return driver.primary_key_create(keys);
	}

	self.primary_key_drop = function() {
		return driver.primary_key_drop();
	}

	self.secondary_key_create = function(keys, other_table, other_keys) {
		return driver.secondary_key_create(keys, other_table, other_keys);
	}

	self.insert = function(row) {
		return driver.insert(row);
	}

	self.modify = function(query, row) {
		return driver.modify(query, row);
	}

	self.delete = function(query) {
		return driver.delete(query);
	}

	self.find = function(query) {
		return driver.find(query);
	}

	return self;
}
