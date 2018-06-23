console.log('loading')
const AWS = require('aws-sdk')

//NOTE:This function will

//1. Read contacts from dynamo DB

//2. Publish SNS to triggerSMS
exports.handle = (e,ctx,cb) => {
    console.log('e es igual a: ', e, ' typeof: ',typeof(e), 'e.message = ', e.message)

    //stringify message
    let stringifiedMessage = JSON.stringify(e.message)

    var sns = new AWS.SNS();
    var params = {
        Message: stringifiedMessage,
        Subject: "Test SNS From Lambda",
        TopicArn: "arn:aws:sns:us-east-2:812207345852:triggersms"
    };

    sns.publish(params, (err, data) => {
        if(err) {
            console.error('error publishing to SNS');
            ctx.fail(err);
        } else {
            console.info('message published to SNS');
            ctx.done(null, data);
        }
    });
}
