const express = require('express')
const cors = require('cors')
const users = require('./reviews.js')
const app = express();
app.use(cors())
const port = 6896;
app.use(express.json());

app.get('/reviews', (req, res) => {
  let output = '';
  users.forEach(r => {
    output += `username: ${r.username}, Review: ${r.Review}\n`;
  });
  res.type('text/plain').send(output || 'No reviews');
});

app.post('/reviews', (req, res) => {
  const username = req.query.username;
  const review = req.query.review;
  if (!username || !review) {
    res.status(400).send('Missing username or review');
    return;
  }
  users.push({ username, Review: review });
  res.send(`Review added: username=${username}, Review=${review}`);
});

app.delete('/reviews/:username', (req, res) => {
  const username = req.params.username;
  const index = users.findIndex(r => r.username == username);
  if (index === -1) {
    res.status(404).send('Review not found');
    return;
  }
  const deleted = users.splice(index, 1)[0];
  res.send(`Deleted review: username=${deleted.username}, Review=${deleted.Review}`);
});

app.put('/reviews/:username', (req, res) => {
  const username = req.params.username;
  const review = req.query.review;
  const index = users.findIndex(r => r.username == username);
  if (index === -1) {
    res.status(404).send('Review not found');
    return;
  }
  if (!review) {
    res.status(400).send('Missing review');
    return;
  }
  users[index].Review = review;
  res.send(`Updated review: username=${username}, Review=${review}`);
});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});