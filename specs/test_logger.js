var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.helper("logger").info("This is an info message!");
jnode.helper("logger").debug("This is a debug message!");
jnode.helper("logger").error("This is an error message!");
jnode.helper("logger").warn("This is a warning message!");
