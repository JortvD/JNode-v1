var jnode = require("../index")();
jnode.root += "specs/";

// TEST //
var socket = jnode.socket();
socket.room("test").broadcast("test", "test");
socket.close();