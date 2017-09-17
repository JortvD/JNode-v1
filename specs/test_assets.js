var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
jnode.assets("css")
.then(function(req, res, file) {
	res.send(file.data);
});
jnode.assets("css", "css")
.then(function(req, res, file) {
	res.send(file.data);
});
