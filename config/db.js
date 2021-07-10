const { Sequelize } = require('sequelize');
//importar los valores de las variables
require('dotenv').config({path: 'variables.env'});

const db = new Sequelize(
    process.env.DB_NOMBRE, 
    process.envDB_USER,
    process.env.DB_PASS ,
 {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  operatorsAliases: false,
  define: {
      timestamps: false
  }
});
module.exports = db;