var file = require("../lib/utils/file.js");
var jnode = require("../index")();
jnode.rot += "specs/";

var _file = file(jnode.root + "icon/favicon.ico");
_file.read()
.then(function() {
	console.log("Read the file!");
});