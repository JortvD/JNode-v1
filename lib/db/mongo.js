module.exports = function() {
	var self = {};

	self.connect = function(username, password, port) {

	}

	self.close = function() {

	}

	self.database_select = function(name) {

	}

	self.database_create = function(name) {

	}

	self.database_drop = function(name) {

	}

	self.table_select = function(name) {

	}

	self.table_create = function(name) {

	}

	self.table_drop = function(name) {

	}

	self.table_clear = function() {

	}

	self.table_clone = function(clone) {

	}

	self.column_make = function(name, datatype, options) {

	}

	self.column_add = function(column) {

	}

	self.column_drop = function(name) {

	}

	self.column_modify = function(name, column) {

	}

	self.primary_key_create = function(keys) {

	}

	self.primary_key_drop = function() {

	}

	self.secondary_key_create = function(keys, other_table, other_keys) {

	}

	self.insert = function(row) {

	}

	self.modify = function(query, row) {

	}

	self.delete = function(query) {

	}

	self.find = function(query) {

	}

	return self;
}
