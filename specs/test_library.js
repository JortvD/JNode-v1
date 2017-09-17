var jnode = require("../index")(); 
jnode.root += "specs/"; 
jnode.init();
 
// TEST // 
jnode.library("library")(); 
jnode.library("library")();