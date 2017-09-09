module.exports = function() {
	var self = {};

	var mysql = require('mysql');
	var promise = require("../utils/promise");

	self.connection = null;
	self.domain = null;
	self.username = null;
	self.password= null;
	self.port = null;
	self.database = null;
	self.table = null;

	self.connect = function(domain, username, password, port, database) {
		self.domain = domain || "localhost";
		self.username = username || "";
		self.password = password || "";
		self.port = port || 3306;
		self.database = database || null;

		return new promise(function(succes, failure) {
			self.connection = mysql.createConnection({
				host: domain,
				user: username,
				password: password,
				port: port,
				database: database
			});

			self.connection.connect(function(err) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.close = function() {
		return new promise(function(succes, failure) {
			self.connection.end(function(err) {
				if(err) {
					failure(err);
					return;
				}

				self.connection.destroy();

				succes();
			});
		});
	}

	self.database_select = function(name) {
		return new promise(function(succes, failure) {
			self.close()
			.then(function() {
				self.connect(self.domain, self.username, self.password, self.port, name)
				.then(succes)
				.catch(failure);
			})
			.catch(failure);
		});
	}

	self.database_create = function(name) {
		return new promise(function(succes, failure) {
			self.connection.query("CREATE DATABASE IF NOT EXISTS " + name, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				self.database_select(name)
				.then(succes)
				.catch(failure);
			});
		});
	}

	self.database_drop = function(name) {
		return new promise(function(succes, failure) {
			var sql = "DROP DATABASE " + name;

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.table_select = function(name) {
		self.table = name;
	}

	self.table_create = function(name) {
		return new promise(function(succes, failure) {
			var sql = "CREATE TABLE IF NOT EXISTS " + name + " "
					+ "(_id INT AUTO_INCREMENT, PRIMARY KEY (_id))";

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				self.table_select(name);

				succes()
			});
		});
	}

	self.table_drop = function(name) {
		return new promise(function(succes, failure) {
			var sql = "DROP TABLE " + name;

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.table_clear = function() {
		return new promise(function(succes, failure) {
			var sql = "TRUNCATE " + self.table;

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.column_make = function(name, datatype, options) {
		if(options != null) {
			return name + " " + datatype + options.join(" ");
		}
		else {
			return name + " " + datatype;
		}
	}

	self.column_add = function(column) {
		return new promise(function(succes, failure) {
			var sql = "ALTER TABLE " + self.table + " "
					+ "ADD COLUMN IF NOT EXISTS " + column;

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.column_drop = function(name) {
		return new promise(function(succes, failure) {
			var sql = "ALTER TABLE " + self.table + " "
					+ "DROP " + name;

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.column_modify = function(name, column) {
		return new promise(function(succes, failure) {
			var sql = "ALTER TABLE " + self.table + " "
					+ "CHANGE " + name + " " + column;

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.primary_key_create = function(keys) {
		return new promise(function(succes, failure) {
			var sql = "ALTER TABLE " + self.table + " "
					+ "ADD PRIMARY KEY(" + keys + ")";

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.primary_key_drop = function() {
		return new promise(function(succes, failure) {
			var sql = "ALTER TABLE " + self.table + " "
					+ "DROP PRIMARY KEY";

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.secondary_key_create = function(keys, other_table, other_keys) {
		return new promise(function(succes, failure) {
			var sql = "ALTER TABLE " + self.table + " "
					+ "ADD FOREIGN KEY (" + keys + ") "
					+ "REFERENCES " + other_table + "(" + other_keys + ")";

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.insert = function(row) {
		return new promise(function(succes, failure) {
			var sql = "INSERT INTO " + self.table + " (";

			sql += Object.keys(row).join(", ");
			sql += ") VALUES (";
			sql += Object.values(row).map(function(el) {
				return "'" + el + "'";
			}).join(", ");
			sql += ")";

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.modify = function(query, update) {
		return new promise(function(succes, failure) {
			var sql = "UPDATE " + self.table + " SET ";
			var updates = [];
			var values = [];
			var queries = [];

			for(var i = 0; i < Object.keys(update).length; i++) {
				updates[i] = Object.keys(update)[i] + "=" + "?";
				values[values.length] = update[Object.keys(update)[i]];
			}

			sql += updates.join("=") + " WHERE ";

			for(var i = 0; i < Object.keys(query).length; i++) {
				queries[i] = Object.keys(query)[i] + "=" + "?";
				values[values.length] = query[Object.keys(query)[i]];
			}

			sql += queries.join(" AND ");
			sql = mysql.format(sql, values);

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes();
			});
		});
	}

	self.delete = function(query) {
		return new promise(function(succes, failure) {
			var sql = "DELETE FROM " + self.table + " WHERE ";
			var queries = [];
			var values = [];

			for(var i = 0; i < Object.keys(query).length; i++) {
				queries[i] = Object.keys(query)[i] + "=" + "?";
				values[values.length] = query[Object.keys(query)[i]];
			}

			sql += queries.join(" AND ");
			sql = mysql.format(sql, values);

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes(result);
			});
		});
	}

	self.find = function(query) {
		return new promise(function(succes, failure) {
			var sql = "SELECT * FROM " + self.table + " WHERE ";
			var queries = [];
			var values = [];

			for(var i = 0; i < Object.keys(query).length; i++) {
				queries[i] = Object.keys(query)[i] + "=" + "?";
				values[values.length] = query[Object.keys(query)[i]];
			}

			sql += queries.join(" AND ");
			sql = mysql.format(sql, values);

			self.connection.query(sql, function (err, result) {
				if(err) {
					failure(err);
					return;
				}

				succes(result);
			});
		});
	}

	return self;
}
