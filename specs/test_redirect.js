var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.redirect("/test", "/not_test", 301);
