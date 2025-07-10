const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(cors());

const port = 5110;

app.use(session({
    secret: "Don't tell anyone",
    resave: false,
    saveUninitialized: false,
    cookie: {
  maxAge: 7 * 24 * 60 * 60 * 1000
}

}))

const users = [];

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(422).send("all fields are required");
    }
    const existing = users.find(u => u.username === username);
    if (existing) {
        return res.status(409).send("username already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ username, passwordHash });
    res.json({message: "user Registered"});
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(422).send("all fields are required");
    }
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).send("invalid credentials");
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.status(401).send("invalid credentials");
    }
    req.session.user = { username };
    res.send(`Welcome, ${username}`);
});


app.get("/users", (req, res) => {
    res.json(users.map(u => ({ username: u.username })));
});

app.delete("/users/:username", (req, res) => {
    const { username } = req.params;
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) {
        return res.status(404).send("user not found");
    }
    users.splice(idx, 1);
    res.send("user deleted");
});


app.listen(port, () => {
    console.log(`server runs on port ${port}`)
})