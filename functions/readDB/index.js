console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {

    // let params = {
    //     Item: {
    //         name: 'Franciscano',
    //         last_name: 'Rafartiano',
    //         phone: '+1937833797',
    //     },
    //
    //     TableName: 'contacts'
    // }

    let scanningParameters = {
        TableName: 'contacts',
        Limit: 2000
    }

    docClient.scan(scanningParameters, (err,data)=> {
        err? cb(err, null): cb(null,data)
    })

    // cb(null, 'Read data succesfully')
}
