const Sequelize = require('sequelize');
const connection = require('../database');

const User = connection.define('User',
  {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }
);

User.sync({ force: false }).then(() => { });
module.exports = User;