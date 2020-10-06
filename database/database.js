const Sequelize = require('sequelize');
const connection = new Sequelize('api_games', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = connection;
