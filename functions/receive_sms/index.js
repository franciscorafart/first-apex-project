console.log('Sms reached!')

exports.handle = (e,ctx,cb) => {
    console.log('e is: ', e)

    cb(null, 'Execution complete')
}
