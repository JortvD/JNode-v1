var jnode = require("../index")();
jnode.root += "specs/";

// TEST //
jnode.plugin({
	test: function() {
		console.log("I'm a plugin!");
	}
});
jnode.test();