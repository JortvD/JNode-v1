var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
var api = jnode.api();
var policy = api.load("policy", "policy");
var controller = api.load("controller");
api.policy("test_policy", policy.test);
api.add("test", "test_policy")
.then(controller.test);
