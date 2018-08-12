console.log('loading')
const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})
const uuidv1 = require('uuid/v1') //timestamp
const uuidv4 = require('uuid/v4') //random

let send_sns = (e,ctx,cb, dataSNS, last, all_batch_uuid) =>{

    //2. Publish SNS to triggerSMS
    let telephones = dataSNS.Items.map(m => m.phone)
    let names = dataSNS.Items.map(m => m.name)
    let lastNames = dataSNS.Items.map(m => m.last_name)

    //TODO: include batch identifier that i sent back to the front end

    e['lastNames'] = lastNames
    e['names'] = names
    e['telephones'] = telephones
    e['uuid'] = []
    e['all_batch_uuid'] = all_batch_uuid
    //Create uids for each message
    names.forEach(n =>{
        e['uuid'].push(uuidv1())
    })

    // console.log('e inside send_sns', e)
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
            console.error('error publishing batch to SNS');
            ctx.fail(err);
        } else {
            console.info('message sub-batch published to SNS', data);
            //TODO: keep track of which ones went through and which ones don't
            //at the moment only sending the last one

            if(last){
                //send back uuid to the front end to identify
                data['all_batch_uuid'] = all_batch_uuid
                ctx.done(null, data);
            }
        }
    });
}

exports.handle = (e,ctx,cb) => {

    //Extract unchecked numbers
    let uncheckedNums = e.unchecked.map(m => m.phone)

    //1.Read contacts from dynamo DB
    let scanningParameters = {
        TableName: 'contacts',
        Limit: 2000
    }

    docClient.scan(scanningParameters, (err,data)=> {

        if(err){
            cb(err, null)
        } else{

            //NOTE: divide in batches of 10 (partialData) and do for loop
            let partialData = {Items: []}
            let last = false

            //uid for whole message, not only the individual receipients
            let all_batch_uuid=uuidv4()

            data.Items.forEach((item, idx) => {

                //NOTE: adding only item not unchecked
                let idxUnchecked = uncheckedNums.indexOf(item.phone)
                if (idxUnchecked==-1)
                    partialData.Items.push(item)

                //Reach 10 or end of data
                if((idx+1)%10==0 || idx+1==data.Items.length){ //testing with 2

                    data.Items.length==idx+1? last = true: last=false;
                    send_sns(
                        e,
                        ctx,
                        cb,
                        partialData,
                        last,
                        all_batch_uuid
                    )
                    //empty partialData
                    partialData = {Items: []}
                }
            })

            //send sns with contacts table data (all data in one)
            // send_sns(e,ctx,cb,data)
        }
    })
}
