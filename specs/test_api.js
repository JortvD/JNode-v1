var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
var api = jnode.api();
var controller = api.load("controller");
api.add("test", controller.test);
