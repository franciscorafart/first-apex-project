console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {

    //Extract params.
    let name = e.name
    let lastName = e.lastName
    let phone = e.phone

    let params = {
        // Item: {
        //     name: 'Franciscano',
        //     last_name: 'Rafartiano',
        //     phone: '+1937833797',
        // },
        Item: {
            name: name,
            last_name: lastName,
            phone: phone
        },

        TableName: 'contacts'
    }

    //write into database
    docClient.put(params, (err, data)=> {
        err? cb(err, null): cb(null, data)
    })
}
