/**
 * Nodemailer API client library for node.js.
 * @module EmailClient
 * @author Feliciano.Long
 * @verion 0.1.0
 */

var VERSION = '1.0.0';
var nodemailer = require('nodemailer');
var config = require('config');

/**
 * @class EmailClient
 * @param [mode] {String} Current server running mode
 */

function EmailClient(mode) {
    if (mode === undefined) { mode = "development"; }
	if (!(this instanceof EmailClient)) return new EmailClient(config_mode);

    // create reusable transporter object using the default SMTP transport
    this.mode = mode;

    if (!config.has('email')) { 
        console.log("Email configuration load failed");
        mode = "development";
    } else {
        var email_config = config.get('email');
        var smtp = `smtps://${email_config.username}:${email_config.password}@${email_config.domain}`;
        this.transporter = nodemailer.createTransport(smtp);
    }
}

EmailClient.VERSION = VERSION;
module.exports = EmailClient;

/**
 * Send log as an email
 * @function emailLog
 * @param [title] {String} Email title
 * @param [content] {String} Email context
 * @param [fcb] {function} Failed callback
 */
EmailClient.prototype.emailLog = function(title, content, cb, fcb) {
    title = this.mode + ": " + title;

    if (this.mode.indexOf("production") == -1) {
        console.log(title);
        console.log(content);
        if (typeof(cb) === 'function') {
            cb();
        }
        return;
    }

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"API Server" <server@centaurstech.com>', // sender address
        to: 'server@centaurstech.com', // list of receivers
        subject: title, // Subject line
        //text: content, // plaintext body
        html: content // html body
    };

    // send mail with defined transport object
    this.transporter.sendMail(mailOptions, function(error, info){
        if(error){
            if (typeof(fcb) === 'function') {
                fcb(error);
            }
            return;
        }

        if (typeof(cb) === 'function') {
            cb();
        }
        console.log('Message sent: ' + info.response);
    });
};
