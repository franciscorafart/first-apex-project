console.log('Sms reached!')

exports.handle = (e,ctx,cb) => {
    console.log('e is: ', e)

    //User triggered functionality

    cb(null, 'Execution complete')
}
