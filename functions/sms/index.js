console.log('loading')

//NOTE: might need more time to process large volumes of phone numbers

exports.handle = (e,ctx,cb) => {

    let client = require("twilio")(process.env.accountSid,process.env.authToken)
    console.log('e is: ',e.Records[0].Sns)

    //parse it and extract phone number and SMS message
    let messLoad = JSON.parse(e.Records[0].Sns.Message)

    //TODO: take from-phone from new twilio-phonenumbers table

    if (messLoad.telephones){
        messLoad.telephones.forEach(phone =>{
            //TODO: loop through numbers to queue in Twilio

            client.messages.create({
                body: messLoad.message,
                to: phone,
                from: process.env.fromNumber,
            }).then((message) => console.log(message.sid))
        })
    } else {
        cb(null, 'Error in messLoad.telephone')
    }
    cb(null, 'Message sent!')
    
    //TODO: Create SNS to change value in DB to Sent

}
