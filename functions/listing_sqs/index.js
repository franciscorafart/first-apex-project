const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'})
let sqs = new AWS.SQS({apiVersion:'2012-11-05'})

exports.handle = (e,ctx,cb) => {

    var params = {
      QueueName: 'smsapp',
      // QueueUrl:process.env.queue_url,
      Attributes: {
        'DelaySeconds': '10',
        'MessageRetentionPeriod': '86400'
      }
    };


    sqs.createQueue(params, function(err, data) {
    //NOTE:just prints null as a result
      // err?
      //   cb(console.log("Error", err), null):
      //   cd(null,console.log("Success", data.QueueUrl));
    //NOTE: error message: Access to the resource https://sqs.us-east-2.amazonaws.com/ denied
    err?
        cb(err, null):
        cd(null,data.QueueUrl);
    })
}
