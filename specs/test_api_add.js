var jnode = require("../index")();
jnode.root = "../specs/";

var api = jnode.api();
var controller = api.load("controller");

api.add("test", controller.test);
