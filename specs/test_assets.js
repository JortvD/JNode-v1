var jnode = require("../index")();
jnode.root += "specs/";

// TEST //
jnode.assets("css")
.then(function(req, res, file) {
	res.send(file.data);
});
jnode.assets("css", "css")
.then(function(req, res, file) {
	res.send(file.data);
});
