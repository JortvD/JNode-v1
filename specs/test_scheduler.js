var jnode = require("../index")();
jnode.root += "specs/";

// TEST //
var scheduler = jnode.scheduler();
var date = {
	month: 11,
	day: 3,
	hour: 2,
	minute: 1
};
scheduler.schedule(date, "once")
.then(function() {
	console.log("I'm a scheduler! And I'm alone.");
});
scheduler.schedule(date, "multiple")
.then(function() {
	console.log("I'm a scheduler! This may not be my first time.");
});
scheduler.cancel_all();
