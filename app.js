// to run the app
// create 3 tables,
// have some dummy info
// console.log do it instead console.table
// npm mysql

require("dotenv").config();
// importing internal node packages
const path = require("path");
const fs = require("fs");

// importing external npm packages
const inquirer = require("inquirer");
const validator = require("validator");
const CFonts = require("cfonts");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.USER_NAME,

  // Your password
  password: process.env.USER_PWD,
  database: "employee",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  inquireQ();
});

// inquirer questions
const questions = [
  {
    type: "input",
    message: "What is your full name?",
    name: "fullName",
    validate: (value) => {
      var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (!regName.test(value)) {
        return "Please enter your full name (first & last name)";
      }
      return true;
    },
  },
  {
    type: "input",
    message: "What is your employee id?",
    name: "id",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter a valid ID Number.";
    },
  },
  {
    type: "input",
    message: "Please enter your email:",
    name: "email",
    validate: (value) => {
      if (validator.isEmail(value)) {
        return true;
      }
      return "Please enter a valid e-mail address.";
    },
  },
  {
    type: "list",
    message: "What type of employee are you?",
    choices: ["Manager", "Engineer", "Intern"],
    name: "role",
  },
];

// main function
const inquireQ = () => {
  inquirer
    .prompt([
      // build or finish
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "See Employee",
          //   "Add Employee",
          //   "Remove Employee",
          //   "Updated Employee Role",
          "See Roles",
          //   "Add Role",
          //   "Remove Role",
          "See Department",
          //   "Add Department",
          //   "Remove Department",
          //   "See Manager Employees",
          //   "View Department Budget",
          "Done",
        ],
        name: "moreTeam",
      },
    ])
    .then((response) => {
      const moreTeam = response.moreTeam;
      switch (moreTeam) {
        case "See Employee":  

          break;

        case "Add Employee":
          inquirer.prompt(questions).then((response) => {});
          break;
        //   case "Remove Employee":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "Update Employee Role":
        //   inquirer.prompt(questions).then((response) => {}); break;
        case "See Roles":
          inquirer.prompt(questions).then((response) => {});
          break;
        //   case "Add Role":
        //     inquirer.prompt(questions).then((response) => {}); break;
        //   case "Remove Role":
        //   inquirer.prompt(questions).then((response) => {}); break;
        case "See Department":
            // connection.query("SELECT * FROM products")  
          break;
        //   case "Add Department":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "Remove Department":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "See Manager Employees":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "View Department Budget":
        //   inquirer.prompt(questions).then((response) => {}); break;

        case "Done":
          connection.end();
          break;
        default:
          break;
        //end of switch
      }
    });
};


// REFERENCE!!!

// function createProduct() {
//   console.log("Inserting a new product...\n");
//   var query = connection.query(
//     "INSERT INTO products SET ?",
//     {
//       flavor: "Rocky Road",
//       price: 3.0,
//       quantity: 50
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " product inserted!\n");
//       // Call updateProduct AFTER the INSERT completes
//       updateProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

// function updateProduct() {
//   console.log("Updating all Rocky Road quantities...\n");
//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         quantity: 100
//       },
//       {
//         flavor: "Rocky Road"
//       }
//     ],
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

// function deleteProduct() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
//     {
//       flavor: "strawberry"
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// }

// function readProducts() {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }





// IMPORTANTE
// inquirer.prompt(questions).then((response) => {
    //     // if (response.role === "Manager") {
    //     //   inquirer
    //     //     .prompt({
    //     //       type: "input",
    //     //       message: "What is your office number?",
    //     //       name: "officeNum",
    //     //       validate: (value) => {
    //     //         if (validator.isInt(value)) {
    //     //           return true;
    //     //         }
    //     //         return "Please enter a valid office number";
    //     //       },
    //     //     })
    //     //     .then((managerOffice) => {
    //     //       inquireQ();
    //     //     });
    //     // }
    //   });