const http = require("http");
const server_func = require('./server_func')

const hostname = "localhost";
const port = 9000;


const requestHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/inventory" && req.method === "GET") {
    server_func.getAllInventory(req, res);
  } else if (req.url === "/inventory" && req.method === "POST") {
    server_func.AddInventory(req, res);
  } else if (req.url === "/inventory" && req.method === "PUT") {
    server_func.updateInventory(req, res)
  } else if (req.url === "/inventory" && req.method === "DELETE") {
    server_func.deleteInventory(req, res)
  }
};

const server = http.createServer(requestHandler);
server.listen(port, hostname, () => {
  console.log(`Server is listening on ${hostname}:${port}`);
});
