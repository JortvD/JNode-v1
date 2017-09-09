var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
var db = jnode.database();
db.connect()
.then(function() {
	db.database_create("test")
	.then(function() {
		db.table_create("test_table")
		.then(function() {
			db.column_add("test1");
			db.column_add("test2");
			db.column_add("test3");
			db.insert({"test1": "A", "test2": "Wonderful", "test3": "Test"})
			.then(function() {
				db.modify({"test1": "A"}, {"test3": "Document"})
				.then(function() {
					db.find({"test1": "A"})
					.then(function(result) {
						console.log(result);
						db.close();
					})
					.catch(console.log);
				})
				.catch(console.log);
			})
			.catch(console.log);
		})
		.catch(console.log);
	})
	.catch(console.log);
})
.catch(console.log);
