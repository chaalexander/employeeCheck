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
      if (validator.isDecimal(value)) {
        return true;
      }
      return "Please enter a valid salary ex:(300000)";
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
const addEmployee = [
  {
    type: "input",
    message: "What is your first name?",
    name: "first_name",
    validate: (value) => {
      if (validator.isAlpha(value)) {
        return true;
      }
      return "Please enter a valid first name (a-z)";
    },
  },
  {
    type: "input",
    message: "What is your last name?",
    name: "last_name",
    validate: (value) => {
      if (validator.isAlpha(value)) {
        return true;
      }
      return "Please enter a valid last name (a-z)";
    },
  },
  {
    type: "input",
    message: "Please enter your role ID:",
    name: "role_id",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter a valid role ID (numbers)";
    },
  },
  {
    type: "input",
    message: "Please enter your manager ID:",
    name: "manager_id",
    validate: (value) => {
      if (validator.isInt(value)) {
        return true;
      }
      return "Please enter a valid manager ID (numbers)";
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
          "Add Role",
          "View Roles",
          "Delete Roles",
          "Add Employee",
          "View Employees",
          "Updated Employee Role",
          "Update Employee Managers",
          "Remove Employee",
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

        case "Delete Departments":
          connection.query("SELECT * FROM departments ", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "input",
                  message: "Enter the department id you want to delete.",
                  name: "deleteDepartments",
                },
              ])
              .then((answer) => {
                connection.query(
                  "DELETE FROM departments WHERE id=? ",
                  [answer.deleteDepartments],
                  function (err, res) {
                    if (err) throw err;
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
          });
          break;

        case "Add Role":
          ask.prompt(addRole).then((answer) => {
            connection.query(
              "INSERT INTO roles SET ?",
              {
                title: answer.title,
                salary: answer.salary,
                department_id: parseInt(answer.department_id),
              },
              function (err) {
                if (err) throw err;
                console.log("Successfully added role!");
                // view the roles
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

        case "View Roles":
          connection.query("SELECT * FROM roles", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;

        case "Delete Roles":
          connection.query("SELECT * FROM roles", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "input",
                  message: "Enter the role id you want to delete.",
                  name: "deleteRoles",
                },
              ])
              .then((answer) => {
                connection.query(
                  "DELETE FROM roles WHERE id=? ",
                  [answer.deleteRoles],
                  function (err, res) {
                    if (err) throw err;
                    connection.query("SELECT * FROM roles", function (
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
          ask.prompt(addEmployee).then((answer) => {
            connection.query(
              "INSERT INTO  employees SET ?",
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: parseInt(answer.role_id),
                manager_id: parseInt(answer.manager_id),
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

        case "Remove Employee":
          connection.query("SELECT * FROM employees", function (err, res) {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "input",
                  message: "Enter the ID of the employee you want to remove.",
                  name: "removeEmployee",
                },
              ])
              .then((answer) => {
                connection.query(
                  "DELETE FROM employees WHERE id=? ",
                  [answer.removeEmployee],
                  function (err, res) {
                    if (err) throw err;
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
          });

          break;

        case "Update Employee Role":
          inquirer.prompt(questions).then((response) => {});
          break;

        case "See Manager Employees":
          inquirer.prompt(questions).then((response) => {});
          break;

        case "Finish":
          connection.end();
          break;
        default:
          break;
        //end of switch
      }
    });
};


