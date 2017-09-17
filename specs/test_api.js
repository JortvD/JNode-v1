var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
var api = jnode.api();
var controller = api.load("controller");
api.add("test").then(controller.test);
