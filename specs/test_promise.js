var promise = require("../lib/utils/promise.js")();

function call(callback) {
	callback("ERR", "TEST");
}

function test() {
	return new promise(function(then, c) {
		call(function(err, val) {
			then(err);
			c(val);
		});
	});
}

test().then(function(val) {
	console.log(val);
}).catch(function(err) {
	console.log(err);
});
