console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e, ctx, cb) => {
    console.log('e: ', e)
    let params = {
        TableName: 'contacts',
    }
    // docClient.deleteItem(params, (err, data)=>{
    //     err? cb(err, null): cb(null, data)
    // })
    cb(null, 'Ready!')
}
