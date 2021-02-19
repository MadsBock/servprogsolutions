const http = require("http")


function SplitCookieString(cookies="") {
    //Example:
    // Before: (string) 'cookie1=foo; cookie2=bar'
    // After: (object) {cookie1:foo, cookie2:bar}
    var res = {}
    const cookieArray = cookies.split(";")
    cookieArray.forEach(c=>{
        var singleCookie = c.trim().split("=")
        var id = singleCookie[0]
        var value = singleCookie[1]
        res[id] = value
    })

    return res
}

const server = http.createServer((req,res)=>{
    //Asks the client to set 2 different cookies, wherof one is session and the other have an expiration.
    res.setHeader("Set-Cookie", ["cookie1=foo; Max-Age=3600", "cookie2=bar"])

    //Unpacks the Cookie header into a usable JS object. Returns it in JSON format to the client.
    const cookieObj = SplitCookieString(req.headers.cookie)
    res.end(JSON.stringify(cookieObj))
})

server.listen(8080)