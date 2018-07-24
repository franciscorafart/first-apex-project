const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})

exports.handle = (e,ctx, cb) => {
    let params = {
        'TableName': 'contacts'
    }

    e.forEach((el,idx) =>{
        console.log('el '+idx+': '+el)

        let name = el.name
        let lastName = el.lastName
        let phone = '1'+el.mobile

        params['Item'] = {
            name: name,
            last_name: lastName,
            phone: phone,
        }

        docClient.put(params, (err, data)=> {
            err? cb(err, null): console.log('Wrote '+name+' to database')
        })
    })

    cb(null, 'Finished writing csv to database')
}
