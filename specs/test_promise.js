var promise = require("../lib/utils/promise.js");

function call(callback) {
	setTimeout(function() {
		callback("ERR", "TEST");
	}, 1);
}

function test() {
	return new promise(function(succes, failure, event) {
		call(function(err, val) {
			event("error", err);
			event("then", val);
		});
	});
}

test()
.then(function(ev, val) {
	console.log(val);
})
.then(function(ev, val) {
	console.log(val);
})
.catch(function(ev, err) {
	console.log(err);
});
