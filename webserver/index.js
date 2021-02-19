const http = require("http")
const fs = require("fs")

const server = http.createServer((req,res)=>{
    //Log the request url for debugging purposes
    console.log(req.url)

    //first, split the parameteres away from the path of the url.
    //before: /test?foo=bar
    //after: /test
    var path = req.url.split("?")[0]
    
    //second, add the folder to the path
    //before: /test
    //after: ./docs/test
    path = "docs" + path

    //If the path is a folder, append 'index.html'
    if(path.endsWith("/")){
        path = path + "index.html"
    }

    //use the path to find the file
    fs.readFile(path, (err, data)=>{
        if(err) {
            console.error(err)
            res.statusCode = 404
        } else {
            res.write(data)
        }
        res.end()
    })
})



console.log("This server serves the files in the /docs folder")
console.log("Listening on port 8080")
server.listen(8080)

/*
Suggestions for better practice:
 - Use JS Promises instead of callbacks
 - More precise error handling (i.e. don't just say 404)
 - Use the "mime-types" package to find the correct mime type and use it to set the Content-Type header
*/