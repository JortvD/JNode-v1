var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.view("view", "view.html")
.then(function(req, res, file) {
	res.send(file.data);
});
