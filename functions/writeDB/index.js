console.log('loading')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx,cb) => {
    console.log('e es igual a ', e)

    let parsedE = JSON.parse(e.Body)

    //Extract params.
    let name = parsedE.name
    let lastName = parsedE.lastName
    let phone = parsedE.phone

    let params = {
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
