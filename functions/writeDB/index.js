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
    }else{ //This is for consumer
        console.log('e',e)
        parsedE = JSON.parse(e.Body)
    }

    let tableName
    let params = {}
    parsedE.type == 'sms'? tableName = 'messages':parsedE.type = 'contact'? tableName = 'contacts': cb('Task type Error in writeDB')  //contacts by default
    //Extract params.
    let name = parsedE.name
    let lastName = parsedE.lastName
    let phone = parsedE.phone
    let mess = parsedE.message

    //params
    params['TableName'] = tableName
    params['Item'] = {
        name: name,
        last_name: lastName,
        phone: phone,
    }
    if(tableName == 'messages'){
        params['Item']['message'] = mess
        params['Item']['sent'] = false
        params['Item']['uuid'] = uuidv1() // //a uuid for messages
    }

    console.log('params',params)
    //write into database
    docClient.put(params, (err, data)=> {
        err? cb(err, null): cb(null, data)
    })
}
