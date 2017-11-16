/**
 * @file centaurs-test-plugin: main functions
 * @copyright Centaurs Technologies Co. 2017
 * @author Yuancheng Zhang & Feliciano.Long
 * @license Unlicense
 * @module lib/plugin
 */

var request = require('request'),
	os = require('os'),
	util = require('util');

var Debug = require('./debugger'),
	EmailClient = require('./email');

var App = {
	/** 
	 * network: hostess and port number
	 * @private 
	 * */
	host: "0.0.0.0",
	port: 10021,
	app_name: '',
	/**
	 * minimum test interval time in milliseconds (at least 10 sec)
	 * @private
	 */
	test_min_interval: 1000 * 10,
	sys_check_min_interval: 1000 * 10,

	/** @constructor create a new plugin obj */
	createPlugin: function () {
		var app = {
			emailClient: new EmailClient(process.env.NODE_ENV),
		};

		/**
		 * call test function and send result to server 
		 * at specified intervals (in milliseconds).
		 * @param {Function} test_func - test function
		 * @param {number} [interval>=test_min_interval] - interval (in seconds)
		 */
		app.runTest = function (test_func, interval) {
			interval = interval * 1000;
			if (interval < App.test_min_interval) {
				Debug.print({
					func: 'runTest()',
					type: 'err',
					msg: `test function interval ${interval} is less than the limitation ${App.test_min_interval} ms.`
				});
				return;
			}
			if (!App.app_name) {
				Debug.print({
					func: 'runTest()',
					type: 'err',
					msg: `no appliation name, please set "app_name".`
				});
				return;
			}
			if (!test_func || typeof (test_func) !== 'function') {
				Debug.print({
					func: 'runTest()',
					type: 'err',
					msg: `${test_func} is not a valid function.`
				});
				return;
			}
			var path = '/api/gm/test-info/',
				url = `http://${App.host}:${App.port}${path}`,
				info = {},
				log = {};
				
			info.app_name = App.app_name;
			log.func = 'runTest()';
			setInterval(function () {
				try {
					test_func();
					info.retcode = '0';
					info.msg = log.msg = 'test success';
					log.type = 'msg';
				} catch (err) {
					log.type = 'err';
					info.retcode = '1';
					info.msg = log.msg = `${err}`
				}
				Debug.print(log);

				// send result to server
				request.post(
					url,
					{
						json: info
					},
					function (err, response, body) {
						// success
						Debug.print({
							func: 'runTest()',							
							type: 'msg',
							msg: `sending test result to monitor server...`
						});
						if (!err && response.statusCode == 200) {
							if (body.retcode === 0) {
								// success
								Debug.print({
									func: 'runTest()',
									type: 'msg',
									msg: `server got test result success.`
								});
							} else {
								// fail
								Debug.print({
									type: 'err',
									msg: JSON.stringify(body)
								});
							}
						} else if (!err) {
							// fail
							Debug.print({
								func: 'runTest()',
								type: 'err',
								msg: `server status code: ${response.statusCode}`
							});
						} else {
							// fail
							Debug.print({
								func: 'runTest()',
								type: 'err',
								msg: `${err}`
							});
						}
					}
				);
			}, interval);
		};

		/**
		 * send system info at specified intervals (in seconds).
		 * @param {number} [interval>=sys_check_min_interval] - interval (in seconds)
		 */
		app.sysCheck = function (interval) {
			var interval = interval * 1000;
			if (interval < App.sys_check_min_interval) {
				Debug.print({
					func: 'sysCheck()',
					type: 'err',
					msg: `system checking interval ${interval} is less than the limitation ${App.sys_check_min_interval} ms.`
				});
				return;
			}
			if (!App.app_name) {
				Debug.print({
					func: 'sysCheck()',
					type: 'err',
					msg: `no appliation name, please set "app_name".`
				});
				return;
			}
			var path = '/api/gm/server-info/',
				url = `http://${App.host}:${App.port}${path}`,
				memUsage = util.inspect(process.memoryUsage()) + '',
				memStrs = memUsage.split(','),
				str = memStrs[0],
				info = {};
				
			info.app_name = App.app_name;
			setInterval(function () {
				info.srv_alc = (parseInt(str.substring(str.indexOf(":") + 1)) / 1024).toFixed()
				info.srv_free = (info.srv_alc - parseInt(memStrs[2].substring(memStrs[2].indexOf(':') + 1)) / 1024).toFixed()

				info.sys_free = (os.freemem() / 1024).toFixed()
				info.sys_sum = (os.totalmem() / 1024).toFixed()

				request.post(
					url,
					{
						json: info
					},
					function (err, response, body) {
						// success
						Debug.print({
							func: 'sysCheck()',
							type: 'msg',
							msg: `sending system info to monitor server...`
						});
						if (!err && response.statusCode == 200) {
							if (body.retcode === 0) {
								// success
								Debug.print({
									func: 'sysCheck()',
									type: 'msg',
									msg: `server got system info success.`
								});
							} else {
								// fail
								Debug.print({
									func: 'sysCheck()',
									type: 'err',
									msg: JSON.stringify(body)
								});
							}
						} else if (!err) {
							// fail
							Debug.print({
								func: 'sysCheck()',
								type: 'err',
								msg: `server status code: ${response.statusCode}`
							});
						} else {
							// fail
							Debug.print({
								func: 'sysCheck()',
								type: 'err',
								msg: `${err}`
							});
						}
					}
				);
			}, interval);
		};

		/**
		 * get all configure infomation
		 * @return {Object} info - all configure infomation
		 */
		app.getConfig = function () {
			var info = {};
			info.host = App.host;
			info.port = App.port;
			info.app_name = App.app_name;
			info.test_min_interval = App.test_min_interval;
			info.sys_check_min_interval = App.sys_check_min_interval;
			info.debug_mode = Debug.debug_mode;
			return info;
		}

		/**
		 * info all configure infomation with desciption
		 */
		app.showConfig = function () {
			var config = [
				`host: ${App.host}`,
				`port: ${App.port}`,
				`app_name: ${App.app_name}`,
				`test_min_interval: ${App.test_min_interval}ms (${App.test_min_interval / 1000}sec)`,
				`sys_check_min_interval: ${App.sys_check_min_interval}ms (${App.sys_check_min_interval / 1000}sec)`,
				`debug_mode: ${Debug.debug_mode ? 'on' : 'off'}`
			];
			var msg = config.forEach((s) => {
				var log = {
					type: 'info',
					msg: s,
					func: 'showConfig()'
				}
				Debug.print(log);
			});
		}

		/**
		 * set one of parameters of plugin
		 * @param {string} key - parameter name
		 * @param {any} value - parameter value
		 */
		app.set = function (key, value) {
			var log = {};
			log.func = 'set()';
			if (key in App) {
				if (typeof (App[key]) === 'function') {
					log.type = 'err';
					log.msg = `"${key}" is a function, cannot be changed.`;
				} else if (typeof (App[key]) !== typeof (value)) {
					log.type = 'err';
					log.msg = `"${key}" is ${typeof (App[key])}, is should be ${typeof (value)}.`;
				} else {
					App[key] = value;
					log.type = 'msg';
					log.msg = `set "${key}" to "${value}".`;
				}
			} else {
				log.type = 'err';
				log.msg = `"${key}" doesn't exist.`;
			}
			Debug.print(log);
		}

		/**
		 * set parameters of plugin as an object
		 * @param {Object} params - parameter name
		 */
		app.setObj = function (param_obj) {
			for (var key in param_obj) {
				var value = param_obj[key];
				app.set(key, value);
			}
		}

		/**
		 * turn on/off debug mode
		  * @param {boolean} on - on/off
		  */
		app.toggleDebugMode = function (on) {
			var log = {
				func: 'toggleDebugMode()',
				type: 'msg',
				msg: `debug mode turns ${on ? 'on' : 'off'}`
			}
			Debug.print(log);
			Debug.toggleDebugMode(on);
		}

		app.sendEmail = function (title, content, cb, fcb) {
			title = `[${App.app_name}]` + title;
			app.emailClient.emailLog(title, content, cb, fcb);
		}

		return app;
	}
}

exports = module.exports = App.createPlugin();
