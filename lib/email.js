/**
 * Nodemailer API client library for node.js.
 * @module EmailClient
 * @author Feliciano.Long
 * @verion 0.1.0
 */

var VERSION = '1.0.0';
var nodemailer = require('nodemailer');
var config = require('config-yml');

/**
 * @class EmailClient
 * @param [mode] {String} Current server running mode
 */

function EmailClient(mode) {
    if (mode === undefined) { mode = "development"; }
	if (!(this instanceof EmailClient)) return new EmailClient(config_mode);

    // create reusable transporter object using the default SMTP transport
    this.mode = mode;
    this.transporter = nodemailer.createTransport('smtps://${config.email.username}:${config.email.password}@${config.email.domain}');
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
EmailClient.prototype.emailLog = function(title, content, fcb) {
    title = this.mode + ": " + title;

    if (this.mode.indexOf("production") == -1) {
        console.log(title);
        console.log(content);
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
            fcb(error);
            return;
        }

        console.log('Message sent: ' + info.response);
    });
};
