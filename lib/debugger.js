/** 
 * @file centaurs-test-plugin: debug mode
 * @copyright Centaurs Technologies Co. 
 * @author Yuancheng Zhang
 * @license Unlicense
 * @module lib/debugger
 */

var colors = require('colors');

var EmailClient = require('./email'),
	mode = process.env.NODE_ENV,
	emailClient = new EmailClient(mode);

var Debugger = {
	title: 'PLUGIN',
	debug_mode: true,
	email_alert_mode: true,
	/**
	 * @readonly
	 * @enum {string} - colorful string
	 */
	def_types: {
		err: `${'ERR'.red}`,
		msg: `${'MSG'.green}`,
		info: `${'INFO'.blue}`
	},

	/**
	 * output logs in colorful style
	 * @param {Object} log - the log to output
	 * @param {string} log.type - log type w/ different color
	 * @param {string} log.func - log from specific function
	 * @param {string} log.msg - log message
	 */
	print: function (log) {
		var type = log.type.toLowerCase(),
			msg = log.msg;
		if (!log.func) {
			log.func = 'Fn';
		}
		if (log.type.toLowerCase() in this.def_types) {
			if (!log.msg) {
				type = 'err';
				msg = `debug msg is empty.`
			}
		} else {
			type = 'err';
			msg = `debug msg type [${log.type}] is not acceptable.`
		}
		var log_time = getCurrTimeString();
		if (this.debug_mode) {
			console.log(`[${this.title.cyan}][${log_time}][${log.func.yellow}][${this.def_types[type]}]\t${msg}`);
		}
		if (this.email_alert_mode && type === 'err') {
			console.log(`[${this.title.cyan}][${log_time}][${log.func.yellow}][${this.def_types[type]}]\t${msg}`);
			emailClient.emailLog('API Server Error', `[${this.title}][${log_time}][${this.func}][${type.toUpperCase()}]\t${msg}`);
		}
	},

	/**
	 * turn on/off debug mode
	 * @param {boolean} on - on/off
	 */
	toggleDebugMode: function (on) {
		this.debug_mode = on;
	},

	/**
	 * turn on/off email alert mode
	 * @param {boolean} on - on/off
	 */
	toggleEmailAlertMode: function (on) {
		this.email_alert_mode = on;
	}
}

function getCurrTimeString() {
	var d = new Date(),
		year = d.getFullYear(),
		month = ('0' + (d.getMonth() + 1)).slice(-2),
		date = ('0' + d.getDate()).slice(-2),
		hour = ('0' + d.getHours()).slice(-2),
		minute = ('0' + d.getMinutes()).slice(-2),
		second = ('0' + d.getSeconds()).slice(-2),
		ms = ('0' + d.getMilliseconds()).slice(-3);
	return `${year}-${month}-${date} ${hour}:${minute}:${second}.${ms}`
}

exports = module.exports = Debugger;