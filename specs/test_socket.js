var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
var socket = jnode.socket();
socket.room("test").broadcast("test", "test");
socket.close();