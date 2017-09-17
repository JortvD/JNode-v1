var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
jnode.redirect("/test", "/not_test", 301);
