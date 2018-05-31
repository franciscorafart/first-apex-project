const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'})
let sqs = new AWS.SQS({apiVersion:'2012-11-05'})

exports.handle = (e,ctx,cb) => {

    var params = {
         DelaySeconds: 10,
         MessageAttributes: {
          "Title": {
            DataType: "String",
            StringValue: "The Whistler"
           },
          "Author": {
            DataType: "String",
            StringValue: "John Grisham"
           },
          "WeeksOn": {
            DataType: "Number",
            StringValue: "6"
           }
         },
         MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
         QueueUrl: process.env.queue_url
        };

sqs.sendMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.MessageId);
  }
});

    // sqs.sendMessage(params,(err,data)=>{
    //     err? cb(err, null): cb(null, data)
    // });
}
