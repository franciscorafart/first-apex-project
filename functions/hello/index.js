console.log('starting function')
exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)

  //env variable with process.env --> defined in project.json
  cb(null, { hello: process.env.myName })
}
