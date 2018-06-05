let AWS = require('aws-sdk')
let queue_url = process.env.queue_url
let aws_region = process.env.aws_region

let sqs = new AWS.SQS({region: aws_region})
let s3 = new AWS.S3({region: aws_region})

function deleteMessage(receiptHandle, cb){
    sqs.deleteMessage({
        ReceiptHandle: receiptHandle,
        QueueUrl: queue_url
    }, cb);
}

function work(task, cb){
    console.log(task)

    //TODO: do work here (send messages)


    cb();
}

exports.handler = function(event, context, callback){
    work(event.Body, (err)=>{
        err? callback(err): deleteMessage(event.ReceiptHandle, callback)
    })
}
