console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {

    let scanningParameters = {
        TableName: 'contacts',
        Limit: 2000
    }

    docClient.scan(scanningParameters, (err,data)=> {
        err? cb(err, null): cb(null,data)
    })
}
