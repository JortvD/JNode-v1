module.exports = function() {
	var self = {};

	var mongo = require("mongodb").MongoClient;

	self.database = "";
	self.username = "";
	self.password = "";
	self.port = 0;
	self.db = null;
	self.collection = null;

	self.connect = function(username, password, port, database) {
		self.database = database || "";
		self.username = username || "";
		self.password = password || "";
		self.port = port || 0;

		var url = "mongodb://";

		if(self.username != "" && self.password != "") {
			url += self.username + ":" + self.password + "@";
		}

		url += "localhost";

		if(self.port != 0) {
			url += ":" + self.port;
		}

		url += "/" + self.database;

		var error = true;

		mongo.connect(url, function(err, db) {
			if(err) {
				error = err;
				console.log("ERROR!");
				return;
			}

			self.db = db;
			self.database = db.databaseName;
		});

		return error;
	}

	self.close = function() {
		if(self.db != null) {
			self.db.close();
		}
	}

	self.database_select = function(name) {
		self.close();
		self.connect(self.username, self.password, self.port, name);
	}

	self.database_create = function(name) {
		self.close();
		self.connect(self.username, self.password, self.port, name);
	}

	self.database_drop = function(name) {
		self.close();
		self.connect(self.username, self.password, self.port, name);

		if(self.db != null) {
			self.db.dropDatabase();
		}

		self.close();
	}

	self.table_select = function(name) {
		if(self.db != null) {
			self.collection = self.db.collection(name);
		}
	}

	self.table_create = function(name) {
		if(self.db != null) {
			self.collection = self.db.collection(name);
		}
	}

	self.table_drop = function(name) {
		if(self.db != null) {
			self.db.dropCollection(name);
		}
	}

	self.table_clear = function() {
		if(self.db != null) {
			self.db.dropCollection(self.collection.collectionName, function() {
				self.collection = self.db.collection(self.collection.collectionName);
			});
		}
	}

	self.column_make = function(name, datatype, options) {
		return name;
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
