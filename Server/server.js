const http = require("http")
const fs = require("fs")
const path = require("path")

const hostname = 'localhost'
const port = 8000

const htmlFilePath = path.join(__dirname, "static", "index.html")

const htmlFileHandler = function (req, res) {
    if (req.url === '/' || req.url  === '/index.html'){

        fs.readFile(htmlFilePath, (err, data) => {
            if(err) {
                res.writeHead(404)
                res.end('<h1>404 - Page Not Found</h1>')
            }else{
                res.writeHead(200)
                res.end(data)
            }
        })

    }else {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('<h1> Not Found </h1>')
    }
}



const server = http.createServer(htmlFileHandler)
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})