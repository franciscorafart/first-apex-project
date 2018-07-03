console.log('loading')
const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})
const uuidv1 = require('uuid/v1')

let send_sns = (e,ctx,cb, dataSNS, last) =>{

    //2. Publish SNS to triggerSMS

    let telephones = dataSNS.Items.map(m => m.phone)
    let names = dataSNS.Items.map(m => m.name)
    let lastNames = dataSNS.Items.map(m => m.last_name)

    e['lastNames'] = lastNames
    e['names'] = names
    e['telephones'] = telephones
    e['uuid'] = []

    //Create uids for each message
    names.forEach(n =>{
        e['uuid'].push(uuidv1())
    })

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
            console.info('message batch published to SNS');
            if(last){
                ctx.done(null, data);
            }
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

            //NOTE: divide in batches of 10 and do for loop
            let partialData = {Items: []}
            let last = false

            data.Items.forEach((item, idx) => {

                partialData.Items.push(item)

                if((idx+1)%2==0 || idx+1==data.Items.length){ //testin with 2
                    console.log('partialData', partialData)
                    data.Items.length==idx+1? last = true: last=false;
                    send_sns(e,ctx,cb,partialData,last)
                    partialData = {Items: []}
                }
            })

            //send sns with contacts table data (all data in one)
            // send_sns(e,ctx,cb,data)

            //TODO: make the callback here if sending by batches
            // ctx.done(null, data);
        }
    })
}
