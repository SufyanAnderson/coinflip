const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://sufyanA:demo@cluster0.hececbt.mongodb.net/coinFlip?retryWrites=true&w=majority";
const dbName = "coinFlip";

//GWelN3wJbHuGftTY

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('results').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {results: result})
  })
})

app.post('/results', (req, res) => {
  let coinresults = Math.ceil(Math.random()*2)
  let botresult 
  let userInput = req.body.userGuess.toLowerCase()
  if(userInput == 'tails' || userInput == 'heads'){
  

  if(coinresults <= 1) {
    botresult = '|Landed on heads|'

  }

  else if(coinresults <= 2) {
    botresult = '|Landed on tails|'
  }

  let outcome 

  if(botresult === req.body.userGuess) {
    outcome = 'You win!|'
  }
  else {
    outcome = 'You lose!|'
  }
  
  
  //req.body is taking from the json file and an api call is taking place
  db.collection('results').insertOne({userGuess:req.body.userGuess,coinFlipResult: botresult, winOrLose: outcome}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
}
})

app.put('/results', (req, res) => {
  db.collection('results')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/results', (req, res) => {
  db.collection('results').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
