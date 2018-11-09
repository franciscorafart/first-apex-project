console.log('loading')
var AWS = require('aws-sdk')
var pg = require("pg")

exports.handle = (e, ctx, cb) => {

    let conString = process.env.postgres_connect
    var client = new pg.Client(conString);

    client.connect((err) => {
     err? cb(err, null): console.log('connected!');
      // cb(null,data)
    })
}
