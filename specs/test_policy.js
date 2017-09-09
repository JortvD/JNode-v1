var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
var api = jnode.api();
var policy = api.load("policy", "policy");
var controller = api.load("controller");
api.policy("test_policy", policy.test);
api.add("test", "test_policy")
.then(controller.test);
