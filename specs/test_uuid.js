var uuid = require("../lib/utils/uuid.js")();

var uuid1 = uuid.generate();
var uuid2 = uuid.generate();

console.log(uuid.check(uuid1));