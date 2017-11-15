/**
 * Nodemailer API client library for node.js.
 * @module EmailClient
 * @author Feliciano.Long
 * @verion 0.1.0
 */

var VERSION = '0.1.0'
var nodemailer = require('nodemailer');

/**
 * @class EmailClient
 * @param [mode] {String} Current server running mode
 */

function EmailClient(mode) {
	if (!(this instanceof EmailClient)) return new EmailClient(configFile)

    // create reusable transporter object using the default SMTP transport
    this.mode = mode;
    this.transporter = nodemailer.createTransport('smtps://username:password@domain')
}

EmailClient.VERSION = VERSION;
module.exports = EmailClient;

/**
 * Send log as an email
 * @function emailLog
 * @param [title] {String} Email title
 * @param [content] {String} Email context
 */
EmailClient.prototype.emailLog = function(title, content) {
    title = this.mode + ": " + title

    if (this.mode.indexOf("production") == -1) {
        console.log(title)
        console.log(content)
        return
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
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
