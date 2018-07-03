console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})
let client = require("twilio")(process.env.accountSid,process.env.authToken)
//NOTE: might need more time to process large volumes of phone numbers

let writeContactDB = uuid => {

    var params = {
        TableName:"messages",
        Key:{
            uuid: uuid
        },
        UpdateExpression: "set sent = :s",
        ExpressionAttributeValues:{
            ":s":true
        },
        ReturnValues: "UPDATED_NEW"
    }

    console.log("Updating the item...");
    docClient.update(params,(err, data)=>{
        err?
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2)):
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2))
    });
}

let sendMessages = (telephones, twilioNumbers, message, uuid, cb) => {

    telephones.forEach((phone, i) =>{

        //Index to loop through twilioNumbers array
        let fromIdx = i % twilioNumbers.length

        client.messages.create({
            body: message,
            to: phone,
            from: twilioNumbers[fromIdx],
        }).then(message => {
            console.log(message.sid)

            //write back to DB as sent
            writeContactDB(uuid[i])
        })
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
            if(messLoad.telephones && messLoad.message && twilioNumbers && messLoad.uuid)
                sendMessages(messLoad.telephones, twilioNumbers, messLoad.message, messLoad.uuid, cb)
            else
                cb(null, 'Error in messLoad.telephone')
        }
    })

    // cb(null, 'Message sent!')
}
