var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.view("view", "view.html");
jnode.view("view", "view.html", function() {});
