console.log('loading')
const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

let send_sns = (e,ctx,cb, dataSNS) =>{

    //2. Publish SNS to triggerSMS

    let telephones = dataSNS.Items.map(m => m.phone)
    let names = dataSNS.Items.map(m => m.name)
    let lastNames = dataSNS.Items.map(m => m.last_name)

    e['lastNames'] = lastNames
    e['names'] = names
    e['telephones'] = telephones

    console.log('e inside send_sns', e)
    //stringify message
    let stringifiedMessage = JSON.stringify(e)

    var sns = new AWS.SNS();
    var params = {
        Message: stringifiedMessage,
        Subject: "SNS From Lambda",
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

exports.handle = (e,ctx,cb) => {
    console.log('e es igual a: ', e, ' typeof: ',typeof(e), 'e.message = ', e)

    //1.Read contacts from dynamo DB
    let scanningParameters = {
        TableName: 'contacts',
        Limit: 2000
    }

    docClient.scan(scanningParameters, (err,data)=> {

        if(err){
            cb(err, null)
        } else{
            //send sns with contacts table data
            send_sns(e,ctx,cb, data)
        }
    })
}
