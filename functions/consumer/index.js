console.log('loading')

const AWS = require('aws-sdk')
AWS.config.update({region: process.env.aws_region})
let sqs = new AWS.SQS({apiVersion:'2012-11-05'})
let lambda = new AWS.Lambda({region: process.env.aws_region})

//NOTE: to test this function with watcher Enable it in the Lambda Console

function receiveMessage(callback){
    let params = {
        QueueUrl: process.env.queue_url,
        MaxNumberOfMessages: 1,
    }
    sqs.receiveMessage(params, (err,data) => {
        // err? console.error(err,err.stack) : callback(null, data.Messages);
        err? callback(err,null) : callback(null, data.Messages);
    })
}

function invokeWorkerLambda(task, callback){
    let functionName;

    let parsedTask = JSON.parse(task.Body)
    console.log('parsedTask', parsedTask)
    //TODO: make sure its reading this properties
    parsedTask.type == 'sms'? functionName = 'first-apex-project_worker': functionName = 'first-apex-project_writeDB'

    let params = {
        //NOTE: Function name is the Lambda_function_name, not the APEX_Function_name
        FunctionName: functionName,
        InvocationType: 'Event',
        Payload: JSON.stringify(task)
    }
    lambda.invoke(params, (err, data)=>{
        if(err){
            console.error(err, err.stack);
            callback(err);
        } else {
            console.log('data!!', data)
            callback(null, data)
        }
    })
}
//

function handleSQSMessage(context, callback){
    receiveMessage((err, messages) => {

        if (err) {
            console.error(err,err.stack)
            callback(err);
        }

        if(messages && messages.length > 0){
            let invocations = []
            messages.forEach((message) =>{
                // invocations.push((callback)=> {
                //     //TODO: invoke worker here
                invokeWorkerLambda(message, callback)
                //     console.log('Invoking Worker!'+message)
                // })
                console.log('message!!!',message)
            })
            //TODO:remove this when async task
            callback(null, 'Done')

            //TODO: Figure out how to handle recursively without the async

            // async.parallel(invocations, (err)=>{
            //     if (err) {
            //         console.error(err,err.stack)
            //         callback(err);
            //     } else {
            //         if (context.getRemainingTimeInMillis()>20000){
            //             handleSQSMessage(context, callback)
            //         } else {
            //             callback(null, 'Pause')
            //         }
            //     }
            // })
        } else {
            callback(null, 'Done')
        }
    })
}

exports.handle = (e,ctx,cb) => {
    //Lambda that is executed periodicall to consume the SQS queue messages
    // let message = "Testing the Api Consumer"

    //TODO: Consumer task here
    handleSQSMessage(ctx, cb)
    // cb(null, message)
}
