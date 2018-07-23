exports.handle = (e,ctx, cb) => {
    console.log('e in writeDB', e)

    cb(null, 'Finished writing csv to database')
}
