console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {
    console.log('e es igual a ', e.Records[0].Sns)

    let parsedE
    //NOTE: This is sloppy, find better way to check what to parse
    if(e.Records){
        parsedE = JSON.parse(e.Records[0].Sns.Message)
        console.log('In parsing!')
    }else{
        parsedE = JSON.parse(e.Body)
    }

    let tableName
    let params = {}
    parsedE.type == 'sms'? tableName = 'messages':parsedE.type = 'contact'? tableName = 'contacts': cb('Task type Error')  //contacts by default
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
        params['Item']['uuid'] = '3243234' // //a uuid for messages
    }

    console.log('params',params)
    //write into database
    docClient.put(params, (err, data)=> {
        err? cb(err, null): cb(null, data)
    })
}
