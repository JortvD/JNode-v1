var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.not_found(function(req, res) {
	console.log("Nothing was found!");
});
