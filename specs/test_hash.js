var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
console.log(jnode.helper("hash").hash("Hey!"));
var encrypted = jnode.helper("hash").encrypt("Hi?", "SECRET");
console.log(jnode.helper("hash").decrypt(encrypted, "SECRET"));
