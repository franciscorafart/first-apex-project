console.log('loading')

//NOTE: to test this function Enable it in the Lambda Console

exports.handle = (e,ctx,cb) => {
    //Lambda that is executed periodicall to consume the SQS queue messages
    let message = "Testing the Api Consumer"

    //TODO: Consumer task here

    cb(null, message)
}
