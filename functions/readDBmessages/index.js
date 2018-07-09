console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {

    console.log('e es', e)
    //TODO: filter by a message batch identifier

    let scanningParameters = {
        TableName: 'messages',
        Limit: 10000
    }

    docClient.scan(scanningParameters, (err,data)=> {
        err? cb(err, null): cb(null,data)
    })
}
