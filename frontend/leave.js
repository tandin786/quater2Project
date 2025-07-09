const express = require("express");
const items = require("./category.js");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const port = 5008;

app.get("/items", (req, res) => {
  res.send(items);
});

app.get("/items/:Item", (req, res) => {
  Item = req.params.Item;
  const foundItem = items.findIndex((item) => {
    return item.Item === Item;
  });
  if (foundItem !== -1) {
    res.send(items[foundItem]);
  } else {
    res.sendStatus(404);
  }
});

app.post("/items", (req, res) => {
  if (
    !req.body.Item ||
    typeof req.body.Item !== "string" ||
    !req.body.Image ||
    typeof req.body.Image !== "string"
  ) {
    res.sendStatus(422);
    return;
  }
  items.push({
    Item: req.body.Item,
    Image: req.body.Image,
  });
  res.sendStatus(201);
});

app.put("/items/:Item", (req, res) => {
  const itemParam = req.params.Item;
  if (
    !req.body.Item ||
    typeof req.body.Item !== "string" ||
    !req.body.Image ||
    typeof req.body.Image !== "string"
  ) {
    res.sendStatus(422);
    return;
  }
  const index = items.findIndex((item) => {
    return item.Item === itemParam;
  });

  if (index !== -1) {
    items[index].Item = req.body.Item;
    items[index].Image = req.body.Image;
    const updatedItem = items[index];
    res.send(updatedItem);
  } else {
    res.sendStatus(404);
  }
});


app.get("/item", (req, res) => {
  res.send(item);
});

app.get("/item/:Item", (req, res) => {
=======
app.delete("/items/:Item", (req, res) => {

  const Item = req.params.Item;
  const index = items.findIndex((item) => {
    return item.Item === Item;
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
});

