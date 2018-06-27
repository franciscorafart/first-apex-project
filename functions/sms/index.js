console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})
let client = require("twilio")(process.env.accountSid,process.env.authToken)
//NOTE: might need more time to process large volumes of phone numbers

let sendMessages = (telephones, twilioNumbers, message, cb) => {
    telephones.forEach((phone, i) =>{

        //Index to loop through twilioNumbers array
        let fromIdx = i % twilioNumbers.length

        client.messages.create({
            body: message,
            to: phone,
            from: twilioNumbers[fromIdx],
        }).then((message) => console.log(message.sid))
    })

    cb(null, 'Message sent!')
}
exports.handle = (e,ctx,cb) => {

    console.log('e is: ',e.Records[0].Sns)

    //parse it and extract phone number and SMS message
    let messLoad = JSON.parse(e.Records[0].Sns.Message)

    let twilioNumbers = []
    let scanningParameters = {
        TableName: 'twilionumbers',
        Limit: 20
    }
    //From numbers taken from database
    docClient.scan(scanningParameters, (err,data)=> {
        if(err){
            cb(err, null)
        } else {
            for(ph of data['Items']){
                twilioNumbers.push(ph['number'])
            }
            console.log('twilioNumbers',twilioNumbers)
            
            //Call function to send messages
            if(messLoad.telephones && messLoad.message && twilioNumbers)
                sendMessages(messLoad.telephones, twilioNumbers, messLoad.message, cb)
            else
                cb(null, 'Error in messLoad.telephone')
        }
    })

    //TODO: Create SNS to change value in DB to Sent
    // cb(null, 'Message sent!')
}
