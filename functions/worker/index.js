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
    console.log('This is the task: ', task)

    //NOTE: parse to object to extract phone and text
    let load = JSON.parse(task)

        client.messages.create({
            body: load.text,
            to: load.phone,
            from: process.env.fromNumber,
        }).then((message) => console.log('Message succesful: ', message.sid))

        cb();
    // cb(null, 'Message sent!')
}

exports.handle = function(event, context, callback){
    console.log('event', event)
    work(event.Body, (err)=>{
        err? callback(err): deleteMessage(event.ReceiptHandle, callback)
    })
}
