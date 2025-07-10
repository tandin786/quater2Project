const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const session = require("express-session");
app.use(express.json());
app.use(cors());
const port = 7108;

app.use(session({
    secret: "I'll type burger again",
    resave: false,
    saveUninitialized: false,
}))
app.get("/", (req, res)=> {
    res.send("Hellow")
})
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).send("All fields are required");
  }

  const dummyUser = { username: "admin", passwordHash: "$2b$10$..." };

  req.session.user = { username };
  res.send(`Welcome, ${username}`);
});


app.listen(port, () => {
    console.log(`another server is running on port ${port}`)
})


