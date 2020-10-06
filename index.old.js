// statusCode 
// https://pt.wikipedia.org/wiki/Lista_de_c%C3%B3digos_de_estado_HTTP#400_Requisi%C3%A7%C3%A3o_inv%C3%A1lida

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());

// fake database
let id = 3;
var DB = {
  games: [
    {
      id: 1,
      title: 'Call of Duty',
      year: 2019,
      price: 60

    },
    {
      id: 3,
      title: 'GTA V',
      year: 2018,
      price: 120
    },
    {
      id: 2,
      title: 'God of war I',
      year: 2008,
      price: 65
    },
  ]
}

// the first end point
// list all games
app.get('/games', (req, res) => {
  res.statusCode = 200;
  res.send(DB.games);
});

app.get('/game/:id', (req, res) => {
  let id = req.params.id;

  // is not number
  if (isNaN(id)) {
    res.sendStatus(400)
  } else {
    id = parseInt(id);
    const game = DB.games.find(g => g.id == id);
    if (game) {
      res.statusCode = 200;
      res.send(game);
    }
    else {
      res.sendStatus(404);
    }
  }
});

// create new game
app.post('/game', (req, res) => {
  // req.body is anything parser in the body
  const { title, year, price } = req.body;
  if (!title || !year || !price) {
    res.sendStatus(400)
  } else {
    id++;
    const newGame = { id, title, year, price };
    DB.games.push(newGame)
    res.statusCode = 200;
    res.send(newGame);
  }
});


app.delete('/game/:id', (req, res) => {

  let id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400)
  } else {
    id = parseInt(id);
    const index = DB.games.findIndex(g => g.id == id);
    if (index == -1) {
      res.sendStatus(400);
    } else {
      DB.games.splice(index, 1);
      res.sendStatus(200);
    }

  }
});


app.put('/game/:id', (req, res) => {
  let id = req.params.id;

  // is not number
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    id = parseInt(id);
    const game = DB.games.find(g => g.id == id);
    if (game) {
      const { title, year, price } = req.body;
      if (title != undefined) game.title = title;
      if (year != undefined) game.year = year;
      if (price != undefined) game.price = price;
      res.statusCode = 200;
      res.send(game);
    }
    else {
      res.sendStatus(404);
    }
  }
});

app.listen('3000', () => console.log('Startup server on port 3000'))