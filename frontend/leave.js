const express = require('express')
const items = require("./category.js")
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors())
const port = 5008;

app.get("/items", (req, res) => {
  res.send(items)
});

app.get("/items/:Item", (req, res)=> {
  Item = req.params.Item;
  const foundItem = items.findIndex((item)=> {
    return item.Item === Item;
  })
  if(foundItem !== -1){
    res.send(items[foundItem]);
  }
  else{
    res.sendStatus(404);
  }

})
app.post("/items", (req, res) => {
  if(!req.body.Item || typeof req.body.Item !== "string" || !req.body.Image || typeof req.body.Image !== "string"){
    res.sendStatus(422);
    return;
  }
  const highestId = items.sort((a, b) => a.id - b.id)[items.length - 1].id
  items.push({id: highestId +1, Item: req.body.Item, Image: req.body.Image});
  res.sendStatus(201);
})

app.listen(port, () => {
  console.log(`listening to port ${port}`);
})