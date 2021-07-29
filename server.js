'use strict';

require('dotenv').config();


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect('mongodb://localhost:27017/user-db', mongooseOptions)

let jessica = new User({ name: 'jessica', email: "devjessparker@gma.com", books: [{ name: "Hunger Games", description: "Brutal Teenage Warfare", status: "Have Read" }, { name: "Divergent", description: "Brutal Teenage Warfare Pt.2", status: "Have Read"}, { name: "Divergent", description: "Brutal Teenage Warfare Pt.3", status: "Have Not Read" }]
})
jessica.save();

app.get('/auth-test', (req, res) => {
  res.json({ samepleUser: ( { name: 'ricky'}, { person: 'bobby'} ) })
});

app.post('/books', (req, res) => {
  let newUser = new User(req.body);
  newUser.save()
    .then(result => {
      res.json(result);
    })
})

app.get('/books', getAllBooks);

function getAllBooks(req, res) {
  User.find({})
    .then(books => {
      res.json(books);
    })
}


const client = jwksClient({
  jwksUri: 'https://dev-43fqro-e.us.auth0.com/.well-known/jwks.json'
  
});

function getKey(header) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}


app.get('/auth-test', (req, res) => {

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, getKey, {}, function(err, user) {
    if (err) {
      res.send('invalid token - you cannot access this route');
    } else {
      res.json({ 'token': token })
    }
});
});
  

app.listen(PORT, () => {
console.log(`listening on ${PORT}`);
});

