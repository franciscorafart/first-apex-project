console.log('loading')
exports.handle = (e,ctx,cb) => {

    let client = require("twilio")(process.env.accountSid,process.env.authToken)

    client.messages.create({
        body: 'Testing lambdas',
        to: process.env.testNumber,
        from: process.env.fromNumber,
    }).then((message) => console.log(message.sid))

    cb(null, 'Message sent!')
}
