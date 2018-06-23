console.log('loading')
exports.handle = (e,ctx,cb) => {

    let client = require("twilio")(process.env.accountSid,process.env.authToken)
    console.log('e is: ',e.Records[0].Sns)

    //parse it and extract phone number and SMS message
    let messLoad = JSON.parse(e.Records[0].Sns.Message)

    client.messages.create({
        body: messLoad.message,
        to: messLoad.phone,
        from: process.env.fromNumber,
    }).then((message) => console.log(message.sid))

    //TODO: Create SNS to change value in DB to Sent

    cb(null, 'Message sent!')
}
