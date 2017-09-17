var jnode = require("../index")();
jnode.root += "specs/";
jnode.init();

// TEST //
jnode.plugin({
	test: function() {
		console.log("I'm a plugin!");
	}
});
jnode.test();