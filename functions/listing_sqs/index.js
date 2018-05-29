const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {
    let sqs = new AWS.SQS({apiVersion:'2018-29-05'})

    var params = {
      QueueName: 'SQS_QUEUE_NAME',
      Attributes: {
        'DelaySeconds': '00',
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
