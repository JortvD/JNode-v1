/**
 * This class will control all the tasks and create them.
 * @module Scheduler
 */
var scheduler = function() {
	var self = {};

	var jobs = {};
	var uuid = require("../utils/uuid")();
	var scheduler = require("node-schedule");
	var promise = require("../utils/promise");
	var build_date = function(date) {
		var now = new Date();

		var d = new Date(
			date.year || now.getFullYear(),
			date.month || now.getMonth(),
			date.day || now.getDate(),
			date.hour || now.getHours(),
			date.minute || now.getMinutes(),
			date.second || 0
		);

		return d;
	}
	var build_rule = function(date) {
		var date_string = "";

		date_string += (date.second == null) ? (date.second + " ") : "";
		date_string += date.minute || "*";
		date_string += " ";
		date_string += date.hour || "*";
		date_string += " ";
		date_string += date.day || "*";
		date_string += " ";
		date_string += date.month || "*";
		date_string += " ";
		date_string += date.day_of_week || "*";

		return date_string;
	}

	/**
	 * This function will create a new job with the specified date. It will return a promise that will
	 * be called every time the job is invoked. All options of the inserted date can be a string or
	 * number. Use a string for "cron" parameters;
	 * @param  {Object} date               The date object
	 * @param  {Number} [date.second]      The second the job will be called
	 * @param  {Number} [date.minute]      The minute the job will be called
	 * @param  {Number} [date.hour]        The hour the job will be called
	 * @param  {Number} [date.day]         The day the job will be called
	 * @param  {Number} [date.month]       The month in which the job will be called
	 * @param  {Number} [date.year]        The year the job will be called
	 * @param  {Number} [date.day_of_week] The day of the week the job will be called
	 * @param  {String} [type]             The type of job that will be used ("once" for a job that
	 * should be called one, "multiple" for a job that should be called multiple times)
	 * @return {Promise}                   Will return a promise
	 * @function schedule
	 */
	self.schedule = function(date, type) {
		type = type || "once";

		if(type == "once") {
			return new promise(function(succes, failure) {
				var instert_date = build_date(date);
				var id = uuid.generate();

				jobs[id] = scheduler.scheduleJob(instert_date, function(id) {
					succes(id);
				}.bind(null, id));
			});
		}
		else {
			return new promise(function(succes, failure) {
				var date_string = build_rule(date);
				var id = uuid.generate();

				jobs[id] = scheduler.scheduleJob(date_string, function(id) {
					succes(id);
				}.bind(null, id));
			});
		}
	}

	/**
	 * This function will reschedule a job with the specified date.
	 * @param  {UUID}   job                The ID of the job
	 * @param  {Object} date               The date object
	 * @param  {Number} [date.second]      The second the job will be called
	 * @param  {Number} [date.minute]      The minute the job will be called
	 * @param  {Number} [date.hour]        The hour the job will be called
	 * @param  {Number} [date.day]         The day the job will be called
	 * @param  {Number} [date.month]       The month in which the job will be called
	 * @param  {Number} [date.year]        The year the job will be called
	 * @param  {Number} [date.day_of_week] The day of the week the job will be called
	 * @param  {String} [type]             The type of job that will be used ("once" for a job that
	 * @param  {String} [type]             The type of job that will be used ("once" for a job that
	 * should be called one, "multiple" for a job that should be called multiple times)
	 * @function reschedule
	 */
	self.reschedule = function(job, date, type) {
		type = type || "once";

		if(type == "once") {
			var instert_date = build_date(date);

			jobs[job].reschedule(instert_date);
		}
		else {
			var date_string = build_rule(date);

			jobs[job].reschedule(date_string);
		}
	}

	/**
	 * This function will cancel the specified job. Set cancel_next to true if you only want to cancel
	 * The next job.
	 * @param  {UUID}    job       The ID of the job
	 * @param  {Boolean} only_next If the next job should be canceled solely
	 * @function cancel
	 */
	self.cancel = function(job, only_next) {
		cancel_next = cancel_next || false;

		if(only_next) {
			jobs[job].cancelNext();
		}
		else {
			jobs[job].cancel();
		}
	}

	/**
	 * This function will cancel all the jobs.
	 * @function cancel_all
	 */
	self.cancel_all = function() {
		for(var key in jobs) {
			jobs[key].cancel();
		}
	}

	/**
	 * This function will return the date of the next invocation of the specified job.
	 * @param  {UUID} job The ID of the job
	 * @return {Date}     The next invocation of the specified job
	 * @function next
	 */
	self.next = function(job) {
		return jobs[job].nextInvocation();
	}

	return self;
}

module.exports = scheduler;
