// Um middleware é uma funcao que fica no meio da requisicao e resposta
// USER REQ -------[ MIDDLEWARE ]-----------> SERVER
// USER REQ<-------[ MIDDLEWARE ]----------- RES SERVER

const jwt = require('jsonwebtoken');
const jwtSecret = "iamsecretkey";


// next é para dar continuidade na requisicao
function adminAuth(req, res, next) {
  const authToken = req.headers['authorization'];
  if (authToken != undefined) {
    const bearer = authToken.split(' ');
    const token = bearer[1];
    jwt.verify(token, jwtSecret,
      // funcao assincrona
      (err, data) => { // data contem o conteúdo do token (quem está logado, data de expiracao do token...)
        if (err) {
          res.statusCode = 401;
          res.json({ err: "Token inválido" });
        } else {
          res.statusCode = 200;

          // criando variavel dentro da requisicao token e loggedUser 
          // podemos criar quantas variáveis quiser
          req.token = token;
          req.loggedUser = { id: data.id, email: data.email };
          next();
        }

      })
  } else {
    res.statusCode = 401;
    res.json({ err: "Token inválido" });
  }
}

module.exports = {
  adminAuth,
  jwtSecret
};
