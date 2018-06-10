const AWS = require('aws-sdk')
AWS.config.update({region: process.env.aws_region})
let sqs = new AWS.SQS({apiVersion:'2012-11-05'})

exports.handle = (e,ctx,cb) => {

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
         //TODO: get correct message from front-end
         MessageBody: e.message,
         QueueUrl: process.env.queue_url
        };

// sqs.sendMessage(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.MessageId, data);
//   }
// });

    sqs.sendMessage(params,(err,data)=>{
        err? cb(err, null): cb(null, data)
    });
}
