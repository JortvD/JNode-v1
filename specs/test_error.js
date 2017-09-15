var jnode = require("../index")();
jnode.root += "specs/";

// TEST //
jnode.error()
.catch(function(err, req, res) {
	console.log("There was an error!");
});
