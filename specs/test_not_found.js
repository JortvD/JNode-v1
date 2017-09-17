var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
jnode.not_found()
.then(function() {
	console.log("Nothing was found!");
});
