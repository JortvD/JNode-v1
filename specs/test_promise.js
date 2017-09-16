var promise = require("../lib/utils/promise.js");

function call(callback) {
	setTimeout(function() {
		callback("ERR", "TEST");
	}, 1);
}

function test() {
	return new promise(function(succes, failure) {
		call(function(err, val) {
			failure(err);
			succes(val);
		});
	});
}

function test2() {
	return new promise(function(succes, failure) {
		test()
		.then(succes)
		.catch(failure);
	});
}

test2()
.then(function(val) {
	console.log("THEN: " + val);
})
.catch(function(err) {
	console.log("CATCH: " + err);
});
