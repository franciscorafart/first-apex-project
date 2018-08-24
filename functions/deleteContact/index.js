console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e, ctx, cb) => {
    let phone = e.message.phone
    console.log('phone', phone)
    let params = {
        TableName: 'contacts',
        Key:{
            "phone":phone
        }
    }
    docClient.delete(params, (err, data)=>{
        err? cb(err, null): cb(null, data)
    })
    // cb(null, 'Ready!')
}
