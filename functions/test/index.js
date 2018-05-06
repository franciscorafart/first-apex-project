let x = [2,3,4,5,6]

let res = x.map(ex =>{return ex*5})

exports.handle = (e,ctx,cb) =>{
    cb(null, res)
}
