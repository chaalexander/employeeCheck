require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: process.env.USER_NAME,

  password: process.env.USER_PWD,
  database: "employee_db",
});

module.exports = connection;
