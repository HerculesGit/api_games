// statusCode 
// https://pt.wikipedia.org/wiki/Lista_de_c%C3%B3digos_de_estado_HTTP#400_Requisi%C3%A7%C3%A3o_inv%C3%A1lida

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

// ====
// Authenticate with JWT
const jwt = require('jsonwebtoken');
// STEPS
//  1 - create master key (Noone can know!)
const { jwtSecret } = require('./middlewares/adminMiddleware');
// =====

const { adminAuth } = require('./middlewares/adminMiddleware');
const authMiddleware = adminAuth;

// express with bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// express with json
app.use(bodyParser.json());

// =======
// var corsOptions = {
//   origin: 'http://seudominio.com', // Apenas esse dominio pode fazer requisição para sua api
// }
// app.use(cors(corsOptions))
// =======

app.use(cors()); // remove cors error access bloked

const GameModel = require('./database/models/Game');
const UserModel = require('./database/models/User');

// the first end point
// list all games
app.get('/games', authMiddleware, (req, res) => {
  res.statusCode = 200;
  GameModel.findAll({ raw: true }).then((games => res.send(games)));
});

// get one
app.get('/game/:id', authMiddleware, (req, res) => {
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
app.post('/game', authMiddleware, (req, res) => {
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
app.delete('/game/:id', authMiddleware, (req, res) => {
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

// UPDATE
app.put('/game/:id', authMiddleware, (req, res) => {
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


app.post('/user', (req, res) => {
  let { name, email, password } = req.body;
  UserModel.create({ name, email, password }).then(() => {
    res.sendStatus(200)
  })
});

app.post('/auth', (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    res.statusCode = 400;
    res.json({ err: 'O email enviado é obrigatório' });
  } else {
    UserModel.findOne({ raw: true, where: { email: email } }).then(user => {
      if (user) {
        if (user.password == password) {

          // generate token
          jwt.sign(
            // Apenas informações que identifiquem o usuário, mas sem ser dados sensíveis como senha;
            // Isso é chamado de payload, são as informações que estão dentro do Token
            {
              id: user.id, email: user.email
            },
            // chave secreta
            jwtSecret,
            {
              // em quanto tempo quer que expire. É interessante colocar um tempo moderado
              expiresIn: '48h'
            },

            // trabalha com promise, então, error se falar e token se der certo
            (error, token) => {
              if (error) {
                res.statusCode = 500;
                res.json({ err: 'Falha interna' });
              } else {

                res.statusCode = 200;
                res.json({ token: token });
              }
            }
          );
        } else {
          res.statusCode = 401;
          res.json({ err: 'Credenciais inválidas!' });
        }
      } else {
        res.statusCode = 400;
        res.json({ err: 'O email enviado não existe' });
      }
    });
  }
});

app.listen('3000', () => console.log('Startup server on port 3000'))