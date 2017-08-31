var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
var db = jnode.database();
db.connect("mongo");
db.close();
