console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})
const uuidv1 = require('uuid/v1')


exports.handle = (e,ctx,cb) => {

    let parsedE
    //NOTE: This is sloppy, find better way to check what to parse
    if(e.Records){//this is for SNS triggers
        console.log('e es igual a ', e.Records[0].Sns)
        parsedE = JSON.parse(e.Records[0].Sns.Message)
    }else{ //This is for sqs consumer
        console.log('e',e)
        parsedE = JSON.parse(e.Body)
    }

    let tableName
    let params = {}
    parsedE.type == 'sms'? tableName = 'messages':parsedE.type = 'contact'? tableName = 'contacts': cb('Task type Error in writeDB')  //contacts by default

    let mess = parsedE.message

    //params
    params['TableName'] = tableName

    //Add new contact to the DB
    if (tableName == 'contacts'){
        //Extract params old way
        let name = parsedE.name
        let lastName = parsedE.lastName
        let phone = parsedE.phone

        params['Item'] = {
            name: name,
            last_name: lastName,
            phone: phone,
        }

        docClient.put(params, (err, data)=> {
            err? cb(err, null): cb(null, data)
        })
    }

    //Log messages to messages DB
    if(tableName == 'messages'){
        parsedE.names.forEach((name, idx)=>{
            params['Item'] = {
                name: name,
                last_name: parsedE.lastNames[idx],
                phone: parsedE.telephones[idx],
                message: mess,
                sent: false,
                uuid: uuidv1() //a uuid for messages
            }

            docClient.put(params, (err, data)=> {
                err? cb(err, null): console.log('Sent to '+name)
            })
        })
        cb(null, 'Finished writting messages to DB')
    }
}
