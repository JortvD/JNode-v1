/**
 * This class conatins functions for helping with validating strings.
 * @module Validator
 */
var validator = function() {
	var self = {};

	var validators = {};

	/**
	 * This function will add a validator to this helper.
	 * @param  {String} name   The name of the validator
	 * @param  {Function} func The function that validates the string
	 * @function add
	 */
	self.add = function(name, func) {
		validators[name] = func;
	}

	/**
	 * This function will validate if the inserted string is valid. It will validate it using the
	 * specified validator.
	 * @param  {String} name The name of the validator to use
	 * @param  {String} data The string to validate
	 * @return {Boolean}     If the string is valid
	 * @function validate
	 */
	self.validate = function(name, data) {
		return validators[name](data);
	}

	return self;
}

module.exports = validator;
