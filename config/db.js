const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config(
  {
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
  }
);

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'codestud_kimeya_test', 
  process.env.MYSQL_USER || 'codestud_kimeya_agro',
  process.env.MYSQL_PASSWORD || 'F9.C{G53inZJ',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);



const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error);
    throw error;
  }
};


module.exports = {
    sequelize,
    connectMySQL,

    };
