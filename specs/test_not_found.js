var jnode = require("../index")();
jnode.root += "specs/";

// TEST //
jnode.not_found()
.then(function() {
	console.log("Nothing was found!");
});
