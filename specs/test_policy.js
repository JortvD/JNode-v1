var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
var api = jnode.api();
var policy = api.load("policy", "policy");
api.add("test", policy.test);
