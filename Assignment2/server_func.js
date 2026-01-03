const fs = require("fs")
const path = require("path")

const inventoryDbPath = path.join(__dirname, "db", "inventory.json");

function getAllInventory(req, res) {
  fs.readFile(inventoryDbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }

    res.end(data);
  });
}

function AddInventory(req, res){
    const body = []

    req.on("data", (chunk)=>{
        body.push(chunk)
    })

    req.on("end", ()=> {
        const parsedBody = Buffer.concat(body).toString()
        const newInventory = JSON.parse(parsedBody)

        fs.readFile(inventoryDbPath, "utf8", (err, data) => {
            if (err) {
                console.log(err)
                res.writeHead(500)
                res.end(JSON.stringify({ message:
                     "Could not read DB file" }))
            }

            let oldInventory = []

            // If file is empty, start with an empty array
            if (data.trim().length > 0) {
                oldInventory = JSON.parse(data)
            }

            // start new ID
            let newId = 1
            if (oldInventory.length > 0) {
                const lastInventory = oldInventory[oldInventory.length - 1]
                newId = lastInventory.id + 1
            }

            newInventory.id = newId

            const allInventory = [...oldInventory, newInventory]

            fs.writeFile(inventoryDbPath, JSON.stringify(allInventory, null, 2), (err) => {
                if (err) {
                    console.log(err)
                    res.writeHead(500)
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save the new inventory item'
                    }))
                }

                res.setHeader("Content-Type", "application/json")
                res.writeHead(201)
                res.end(JSON.stringify(newInventory))
            })
        })
    })
}

function updateInventory(req, res){
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBody = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBody)
        const inventoryId = detailsToUpdate.id
        fs.readFile(inventoryDbPath, "utf8", (err, items) => {
            if(err){
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            // find the item in the inventory 
            const itemsObj = JSON.parse(items)
            
            const itemIndex = itemsObj.findIndex(item => item.id === inventoryId)
            console.log(itemIndex)

            if (itemIndex === -1){
                res.writeHead(404)
                res.end("Item with the specified id not found!")
                return
            }

            const updatedItems = {...itemsObj[itemIndex], ...detailsToUpdate}
            itemsObj[itemIndex] = updatedItems

            fs.writeFile(inventoryDbPath, JSON.stringify(itemsObj), (err) => {
                if(err){
                    console.log(err)
                    res.writeHead(500)
                    res.end(JSON.stringify({
                        message: 'Internal server error. Could not save items to database'
                    }))
                }

                res.writeHead(200)
                res.end("Update successfull")
            })
        })
    })
}


function deleteInventory(req, res){
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBody = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBody)
        const inventoryId = detailsToUpdate.id

        fs.readFile(inventoryDbPath, "utf8", (err, items) => {
            if(err){
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const itemsObj = JSON.parse(items)
            const itemIndex = itemsObj.findIndex(item => item.id === inventoryId)

            if (itemIndex === -1){
                res.writeHead(404)
                res.end("item with the specified id not found")
                return
            }

            //Delete function
            itemsObj.splice(itemIndex, 1)

            fs.writeFile(inventoryDbPath, JSON.stringify(itemsObj), (err) => {
                if(err){
                    console.log(err)
                    res.writeHead(500)
                    res.end(JSON.stringify({
                        message: 'internal server error. Could not save item to database'
                    }))
                }

                res.writeHead(200)
                res.end('Deleted successfully')
            })
        })
    })
}

module.exports = { getAllInventory, AddInventory, updateInventory, deleteInventory}