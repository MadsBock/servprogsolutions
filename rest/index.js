//NOTE: This uses the database defined in db.sql in this folder

const http = require("http")
const mysql = require("mysql")


var mysqlPool = mysql.createPool({
    host:"localhost",
    user:"servprog",
    password:"1234", //Insert your own credentials here
    database: "servprogsolutionsRest",
    connectionLimit: 10
})

function CheckApiKey(apikey) {
    return new Promise((resolve, reject)=>{

        if(!apikey) {
            resolve(false)
            return
        }

        mysqlPool.query("SELECT id FROM apikeys WHERE apikey = ?", apikey, (err, results)=>{
            if(err) reject(err)
            else {
                resolve(results.length>0)
            }
        })

    })
}

async function FindParameters(req) {
    switch (req.method){
        case "GET": return UnpackGetParameters(req)
        case "POST":return await UnpackPostParameters(req)
    }
}

function UnpackGetParameters(req) {
    return UnpackParameterString(req.url)
}

function UnpackPostParameters(req) {
    //post parameters is in the body. In node, you read these by adding 'data' events to the request object.

    return new Promise((resolve)=>{
        var data = "?"
        req.on("data", chunk=>{
            data += chunk
        })
        req.on("end", ()=>{
            resolve(UnpackParameterString(data))
        })
    })
}

function UnpackParameterString(url) {
    //Creating an empty object to use for return value. Works like a dictionary.
    var res = {}

    //first split parameters from path
    //Before: /test?foo=bar&one=two
    //After: foo=bar&one=two
    var parameters = url.split("?")[1]

    //if parameters is now null, it means there are no parameters
    if(!parameters)
        return res

    //second split the string into an array of strings
    //Before: foo=bar&one=two
    //After: [foo=bar, one=two]
    var parameters = parameters.split("&")

    //third for each entry in this array, split the identifier from the value
    parameters.forEach(p=>{
        const parameter = p.split("=")
        const id = parameter[0]
        const value = parameter[1]

        //Then set the result
        res[id] = value
    })

    return res
}

function Bookings(res,day) {
    const callback = (err,result) =>{
        if(err) throw err
        res.end(JSON.stringify(result))
    }

    //If day is defined, will filter out everything else
    if(day) {
        mysqlPool.query("SELECT * FROM booking_view WHERE day = ?", day, callback)
    } else {
        mysqlPool.query("SELECT * FROM booking_view", callback)
    }
}

function Rooms(res) {
    mysqlPool.query("SELECT * FROM room_view", (err, results)=>{
        if(err) throw err
        res.end(JSON.stringify(results))
    })
}

function Add(res, roomName, bookerName, day) {
    mysqlPool.query("CALL addBooking(?,?,?)", [roomName, bookerName, day] , (err, results)=>{
        if(err) throw err
        res.end(JSON.stringify(results))
    })
}

const server = http.createServer(async (req,res)=>{
    //get the parameters as a JS object
    const params = await FindParameters(req)

    //If the apikey is invalid, the response should be 403, and ended.
    if(!await CheckApiKey(params.apikey)) {
        res.statusCode = 403
        res.end()
        return
    }

    //get the path
    const path = req.url.split("?")[0]

    //The request method
    const method = req.method

    if(path == "/bookings" && method == "GET") {
        Bookings(res, params.day)
    } else if (path == "/rooms" && method == "GET") {
        Rooms(res)
    } else if (path == "/add" && method  == "POST") {
        Add(res, params.roomName, params.bookerName, params.day)
    } else {
        res.statusCode = 404
        res.end()
    }

})

server.listen(8080)

/*
suggestions for better practice
 - Better error handling (i.e. set up catching of errors)
 */