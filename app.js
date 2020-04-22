// importing internal node packages
const path = require("path");
const fs = require("fs");

// importing external npm packages
const ask = require("inquirer");
const validator = require("validator");
const CFonts = require("cfonts");

// importing local files
var connection = require("./connection");

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  inquireQ();
});

const addDept = [
  {
    type: "input",
    message: "Please enter the department you wish to add:",
    name: "department",
    validate: (value) => {
      if (validator.isAlpha(value)) {
        return true;
      }
      return "Please enter a valid department (a-z)";
    },
  },
];

const addRole = [
  {
    type: "input",
    message: "Please enter the role you wish to add:",
    name: "title",
    validate: (value) => {
      if (validator.isAlpha(value)) {
        return true;
      }
      return "Please enter a valid role (a-z)";
    },
  },

  {
    type: "input",
    message: "Please enter the salary for this role:",
    name: "salary",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter a valid salary ex:(3000.00)";
    },
  },
  {
    type: "input",
    message: "Please enter the department ID for this role:",
    name: "department_id",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter a valid department ID(number)";
    },
  },
];

// main function
const inquireQ = () => {
  ask
    .prompt([
      // build or finish
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add Department",
          "View Departments",
          "Delete Departments",
          "Add Roles",
          "View Roles",
          "Delete Roles",
          "Add Employees",
          "View Employees",
          "Updated Employee Role",
          "Update Employee Managers",
          "Delete Employee",
          "Finish",
        ],
        name: "userFunction",
      },
    ])
    .then((res) => {
      const userFunction = res.userFunction;
      // switch case for all options
      switch (userFunction) {
        case "Add Department":
          ask.prompt(addDept).then((answer) => {
            connection.query(
              "INSERT INTO departments SET ?",
              {
                name: answer.department,
              },
              function (err) {
                if (err) throw err;
                console.log("Successfully added department!");
                // show the departments
                connection.query("SELECT * FROM departments", function (
                  err,
                  res
                ) {
                  if (err) throw err;
                  res.length > 0 && console.table(res);
                  inquireQ();
                });
              }
            );
          });
          break;

        case "View Departments":
          connection.query("SELECT * FROM departments", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;

        case "Add Role":
          ask.prompt(addRole).then((answer) => {
            connection.query(
              "INSERT INTO SET ?",
              {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id,
              },
              function (err) {
                if (err) throw err;
                console.log("Successfully added role!");
                // view the roles
                connection.query("SELECT * FROM roles", function (err, res) {
                  if (err) throw err;
                  res.length > 0 && console.table(res);
                  inquireQ();
                });
              }
            );
          });
          break;

        case "View Roles":
          connection.query("SELECT * FROM roles", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;

        case "View Employees":
          connection.query("SELECT * FROM employees", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;
        case "Add Employee":
          ask.prompt(addemployee).then((answer) => {
            connection.query(
              "INSERT INTO SET ?",
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
              },
              function (err) {
                if (err) throw err;
                console.log("Successfully added an employee!");
                // view the employees
                connection.query("SELECT * FROM employees", function (
                  err,
                  res
                ) {
                  if (err) throw err;
                  res.length > 0 && console.table(res);
                  inquireQ();
                });
              }
            );
          });
          break;
        //   case "Remove Employee":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "Update Employee Role":
        //   inquirer.prompt(questions).then((response) => {}); break;

        //   case "Remove Role":
        //   inquirer.prompt(questions).then((response) => {}); break;

        //   case "Remove Department":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "See Manager Employees":
        //   inquirer.prompt(questions).then((response) => {}); break;
        //   case "View Department Budget":
        //   inquirer.prompt(questions).then((response) => {}); break;

        case "Finish":
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
