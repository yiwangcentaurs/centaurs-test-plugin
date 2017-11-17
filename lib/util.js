/**
 * @file centaurs-test-plugin: utilitiy functions
 * @copyright Centaurs Technologies Co. 2017
 * @author Yuancheng Zhang
 * @license Unlicense
 * @module lib/util
 */

/**
 * get current time
 */
module.exports.getCurrTimeString = function getCurrTimeString() {
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