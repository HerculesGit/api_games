// statusCode 
// https://pt.wikipedia.org/wiki/Lista_de_c%C3%B3digos_de_estado_HTTP#400_Requisi%C3%A7%C3%A3o_inv%C3%A1lida

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());
const GameModel = require('./database/models/Game');
const Game = require('./database/models/Game');


// the first end point
// list all games
app.get('/games', (req, res) => {
  res.statusCode = 200;
  GameModel.findAll({ raw: true }).then((games => res.send(games)));
});

// get one
app.get('/game/:id', (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400)
  } else {
    id = parseInt(id);
    GameModel.findOne({
      where: { id: id }
    }).then((game) => {
      res.send(game);
    })
  }

});

// create a new game
app.post('/game', (req, res) => {
  // req.body is anything parser in the body
  const { title, year, price } = req.body;
  if (!title || !year || !price) {
    res.sendStatus(400);
  } else {
    const newGame = { title, year, price };
    GameModel.create(newGame).then(() => {
      res.statusCode = 200;
      res.send(newGame);
    });
  }
});

// delete 
app.delete('/game/:id', (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400)
  } else {
    id = parseInt(id);
    GameModel.findOne(({ raw: true, where: { id: id } })).then(gameToDelete => {
      if (!gameToDelete) {
        res.sendStatus(400)
      } else {
        GameModel.destroy({
          where: { id: id }
        }).then(deletedGame => {
          res.sendStatus(200);
        })
      }
    })
  }
});


app.put('/game/:id', (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    id = parseInt(id);
    GameModel.findOne(({ raw: true, where: { id: id } })).then(gameToUpdate => {
      if (!gameToUpdate) {
        res.sendStatus(400);
      } else {
        Object.keys(gameToUpdate).map(key => {
          if (key !== 'id' && req.body[key]) {
            gameToUpdate[key] = req.body[key];
          }
        });
        GameModel.update(gameToUpdate, { where: { id: id } })
          .then((_) => {
            res.send(gameToUpdate)
          })
      }
    })
  }
});

app.listen('3000', () => console.log('Startup server on port 3000'))