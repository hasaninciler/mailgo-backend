const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mailgo', 'hasaninciler', '', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;