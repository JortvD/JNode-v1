var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.assets("css");
jnode.assets("css");
jnode.assets("css", "css");
