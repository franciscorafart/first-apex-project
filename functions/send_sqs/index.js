const AWS = require('aws-sdk')
AWS.config.update({region: process.env.aws_region})
let sqs = new AWS.SQS({apiVersion:'2012-11-05'})

exports.handle = (e,ctx,cb) => {
    //transform into string
    let parsedMessage = JSON.stringify(e.message)

    var params = {
         DelaySeconds: 10,
         MessageAttributes: {
          "Name": {
            DataType: "String",
            StringValue: "John Grisham"
           },
          "Telephone": {
            DataType: "Number",
            StringValue: "6"
           }
         },
         MessageBody: parsedMessage,
         QueueUrl: process.env.queue_url
        };

    sqs.sendMessage(params,(err,data)=>{
        err? cb(err, null): cb(null, data)
    });
}
