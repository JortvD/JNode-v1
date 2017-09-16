/**
 * This class does all the file management. It currently stores files primarely.
 * @module File
 */
var file = function(path) {
	var self = {};

	var fs = require("fs");
	var _path = require('path');
	var promise = require("../utils/promise.js");
	var replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};

	/**
	 * This is the path of the file.
	 * @constant path
	 */
	self.path = path;

	/**
	 * This string will contains the files data when it is loaded.
	 * @constant data
	 */
	self.data = null;

	/**
	 * This function will read all the file with this class' path.
	 * @return {Promise} Will return a promise
	 * @function read
	 */
	self.read = function() {
		return new promise(function(succes, failure) {
			fs.readFile(self.path, 'binary', function(err, data) {
				if(err) {
					failure(err);
				}

				self.data = data;
				self.type = _path.extname(self.path);

				succes();
			});
		});
	}

	/**
	 * This function will replace all orignal string with the new string.
	 * @param  {String} orignal The original string
	 * @param  {String} new_    The new string
	 */
	self.replace = function(original, new_) {
		self.data = replaceAll(original, new_);
	}

	return self;
}

module.exports = file;
