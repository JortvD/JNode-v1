var jnode = require("../index")();
jnode.root = "../specs/";

// TEST //
jnode.language("en", "en.json");
console.log(jnode.locale("en", "this.is.a"));
