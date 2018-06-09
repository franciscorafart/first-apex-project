let AWS = require('aws-sdk')
let queue_url = process.env.queue_url
let aws_region = process.env.aws_region

let sqs = new AWS.SQS({region: aws_region})
let s3 = new AWS.S3({region: aws_region})
let client = require("twilio")(process.env.accountSid,process.env.authToken)

function deleteMessage(receiptHandle, cb){
    sqs.deleteMessage({
        ReceiptHandle: receiptHandle,
        QueueUrl: queue_url
    }, cb);
}

function work(task, cb){
    console.log(task)

    //TODO: do work here (send messages)


    //TODO: extract message and phone numbers from task
    
    client.messages.create({
        body: 'Testing lambdas',
        to: process.env.testNumber,
        from: process.env.fromNumber,
    }).then((message) => console.log(message.sid))

    // cb(null, 'Message sent!')

    cb();
}

exports.handle = function(event, context, callback){
    work(event.Body, (err)=>{
        err? callback(err): deleteMessage(event.ReceiptHandle, callback)
    })
}
