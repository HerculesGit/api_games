const Sequelize = require('sequelize');
const connection = require('../database');

const Game = connection.define(
  // name
  'game',
  // fields 
  {
    // field
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  }
);

Game.sync({ force: false }).then(() => { })
module.exports = Game;