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
app.delete("/items/:Item", (req, res) => {
  const Item = req.params.Item;


  const index = items.findIndex((cat) => {
    return cat.Item === Item;
  });

  if (index !== -1) {
    items.splice(index, 1);
    res.send("Deleted");
  } else {
    res.sendStatus(404);
  }
});
app.listen(port, () => {
  console.log(`listening to port ${port}`);
})