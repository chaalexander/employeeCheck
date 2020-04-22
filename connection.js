require("dotenv").config();
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.USER_NAME,

  // Your password
  password: process.env.USER_PWD,
  database: "employee_db",
});

module.exports = connection;