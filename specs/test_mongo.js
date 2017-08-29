var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
var db = jnode.database();
console.log(db.connect("mongo"));
