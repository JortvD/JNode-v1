module.exports = function() {
	var self = {};

	var mongo = require("mongodb").MongoClient;
	var promise = require("../utils/promise.js");

	self.domain = "localhost";
	self.database = "";
	self.username = "";
	self.password = "";
	self.port = 0;
	self.db = null;
	self.collection = null;
	self.columns = [];

	self.connect = function(domain, username, password, port, database) {
		self.database = database || "";
		self.username = username || "";
		self.password = password || "";
		self.domain = domain || "localhost";
		self.port = port || 0;

		var url = "mongodb://";

		if(self.username != "" && self.password != "") {
			url += self.username + ":" + self.password + "@";
		}

		url += self.domain;

		if(self.port != 0) {
			url += ":" + self.port;
		}

		url += "/" + self.database;

		var error = true;

		return new promise(function(t, c) {
			mongo.connect(url, function(err, db) {
				if(err) {
					c(err);
					return;
				}

				self.db = db;
				self.database = db.databaseName;

				t();
			});
		});
	}

	self.close = function() {
		return new promise(function(t, c) {
			if(self.db != null) {
				self.db.close(true, function(err) {
					if(err) {
						c(err);
					}

					t();
				});
			}
		});
	}

	self.database_select = function(name) {
		return new promise(function(t, c) {
			self.close()
			.then(function() {
				self.connect(self.domain, self.username, self.password, self.port, name)
				.then(t)
				.catch(c);
			});
		});
	}

	self.database_create = function(name) {
		return self.database_select(name);
	}

	self.database_drop = function(name) {
		return new promise(function(t, c) {
			self.close()
			.then(function() {
				self.connect(self.domain, self.username, self.password, self.port, name)
				.then(function() {
					if(self.db != null) {
						self.db.dropDatabase(function(err, val) {
							if(err) {
								c(err);
								return;
							}

							self.close()
							.then(t)
							.catch(c);
						});
					}
					else {
						self.close()
						.then(c)
						.catch(c);
					}
				})
				.catch(c);
			})
			.catch(c);
		});
	}

	self.table_select = function(name) {
		return new promise(function(t, c) {
			if(self.db != null) {
				self.collection = self.db.collection(name, null, function(err) {
					if(err) {
						c(err);
						return;
					}

					t();
				});
			}
		});
	}

	self.table_create = function(name) {
		return self.table_select(name);
	}

	self.table_drop = function(name) {
		return new promise(function(t, c) {
			if(self.db != null) {
				self.db.dropCollection(name, function(err) {
					if(err) {
						c(err);
						return;
					}

					t();
				});
			}
		});
	}

	self.table_clear = function() {
		return new promise(function(t, c) {
			if(self.db != null && self.collection != null) {
				self.db.dropCollection(self.collection.collectionName, function(err) {
					if(err) {
						c(err);
						return;
					}

					self.table_select(self.collection.collectionName)
					.then(t)
					.catch(c);
				});
			}
		});
	}

	self.column_make = function(name, datatype, options) {
		return name;
	}

	self.column_add = function(column) {
		return new promise(function(t, c) {
			self.columns[self.columns.length] = column;
			t();
		});
	}

	self.column_drop = function(name) {
		return new promise(function(t, c) {
			for(var i = 0; i < self.columns.length; i++) {
				if(self.columns[i] == name) {
					self.columns.splice(i, 1);
					break;
				}
			}

			t();
		});
	}

	self.column_modify = function(name, column) {
		return new promise(function(t, c) {
			for(var i = 0; i < self.columns.length; i++) {
				if(self.columns[i] == name) {
					self.columns[i] = column;
					break;
				}
			}

			t();
		});
	}

	self.primary_key_create = function(keys) {}

	self.primary_key_drop = function() {}

	self.secondary_key_create = function(keys, other_table, other_keys) {}

	self.insert = function(row) {
		return new promise(function(t, c) {
			var obj = {};

			for(var key in self.columns) {
				var column = self.columns[key];
				if(row[column] == null) {
					obj[column] = null;
				}
				else {
					obj[column] = row[column];
				}
			}

			if(self.collection != null) {
				self.collection.insertOne(obj, null, function(err, val) {
					if(err) {
						c(err);
						return;
					}

					t();
				});
			}
		});
	}

	self.modify = function(query, update) {
		return new promise(function(t, c) {
			var obj = {};

			obj["$set"] = update;

			if(self.collection != null) {
				self.collection.updateMany(query, obj, null, function(err, val) {
					if(err) {
						c(err);
						return;
					}

					t();
				});
			}
		});
	}

	self.delete = function(query) {
		return new promise(function(t, c) {
			if(self.collection != null) {
				self.collection.deleteMany(query, null, function(err) {
					if(err) {
						c(err);
						return;
					}

					t();
				});
			}
		});
	}

	self.find = function(query) {
		return new promise(function(t, c) {
			self.collection.find(query).toArray(function(err, val) {
				if(err) {
					c(err);
					return;
				}

				t(val);
			});
		});
	}

	return self;
}
