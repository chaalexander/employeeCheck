// importing external npm packages
const ask = require("inquirer");
const validator = require("validator");
const CFonts = require("cfonts");
const { printTable } = require("console-table-printer");

// importing local files
const connection = require("./connection");

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  inquireQ();
});

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
          "Updated Employee Roles",
          "View Employees by Manager",
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
          ask
            .prompt({
              type: "input",
              message: "Please enter the department you wish to add:",
              name: "department",
              validate: (value) => {
                if (validator.isAlpha(value)) {
                  return true;
                }
                return "Please enter a valid department (a-z)";
              },
            })
            .then((answer) => {
              connection.query(
                "INSERT INTO departments SET ?",
                {
                  name: answer.department,
                },
                function (err) {
                  if (err) throw err;
                  console.log("Successfully added department!");
                  // show the departments
                  connection.query("SELECT * FROM departments", (err, res) => {
                    if (err) throw err;
                    res.length > 0 && console.table(res);
                    inquireQ();
                  });
                }
              );
            });
          break;

        case "View Departments":
          connection.query("SELECT * FROM departments", (err, res) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;

        case "Delete Departments":
          connection.query("SELECT * FROM departments ", (err, departments) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "list",
                  message: "Select the department you would like to delete.",
                  choices: departments.map((departments) => ({
                    value: departments.id,
                    name: departments.name,
                  })),
                  name: "deleteDepartments",
                },
              ])
              .then((answer) => {
                connection.query(
                  "DELETE FROM departments WHERE id=? ",
                  [answer.deleteDepartments],
                  (err, res) => {
                    if (err) throw err;
                    connection.query(
                      "SELECT * FROM departments",
                      (err, res) => {
                        if (err) throw err;
                        res.length > 0 && console.table(res);
                        inquireQ();
                      }
                    );
                  }
                );
              });
          });
          break;

        case "Add Role":
          //view the roles
          connection.query("SELECT * FROM departments", (err, departments) => {
            if (err) throw err;
            // res.length > 0 && console.table(departments);
            ask
              .prompt([
                {
                  type: "input",
                  message: "What is the role title you want to add?",
                  name: "title",
                },
                {
                  type: "input",
                  massage: "Please enter the salary for this role:",
                  name: "salary",
                  validate: (value) => {
                    if (validator.isInt(value)) {
                      return true;
                    }
                    return "Please enter a valid salary ex:(3000.00)";
                  },
                },
                {
                  type: "list",
                  massage: "Please select the department for this role:",
                  choices: departments.map((department) => ({
                    value: department.id,
                    name: department.name,
                  })),
                  name: "department_id",
                },
              ])
              .then((answer) => {
                connection.query(
                  "INSERT INTO roles SET ?",
                  {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                  },
                  (err) => {
                    if (err) throw err;
                    console.log("Successfully added role!");
                    inquireQ();
                  }
                );
              });
          });
          break;

        case "View Roles":
          connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;

        case "Delete Roles":
          connection.query("SELECT * FROM roles ", (err, roles) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "list",
                  message: "Please select the role you wish to delete:",
                  choices: roles.map((role) => ({
                    value: role.id,
                    name: role.title,
                  })),
                  name: "deleteRole",
                },
              ])
              .then((answer) => {
                connection.query(
                  "DELETE FROM roles WHERE id=? ",
                  [answer.deleteRole],
                  function (err, res) {
                    if (err) throw err;
                    connection.query("SELECT * FROM roles", (err, res) => {
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
          connection.query("SELECT * FROM employees", (err, res) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            inquireQ();
          });
          break;
        case "Add Employee":
          //view employees before you add one.
          connection.query("SELECT * FROM roles", (err, roles) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            connection.query("SELECT * FROM employees", (err, employees) => {
              if (err) throw err;
              res.length > 0 && console.table(res);
              //ask the questions to add after displaying current ones
              ask
                .prompt([
                  {
                    type: "input",
                    message: "Please enter employee's first name:",
                    name: "first_name",
                    validate: (value) => {
                      if (validator.isAlpha(value)) {
                        return true;
                      }
                      return "Please enter valid first name (a-z)";
                    },
                  },
                  {
                    type: "input",
                    message: "Please enter employee's last name:",
                    name: "last_name",
                    validate: (value) => {
                      if (validator.isAlpha(value)) {
                        return true;
                      }
                      return "Please enter valid last name (a-z)";
                    },
                  },
                  {
                    type: "list",
                    message: "Please select employee's role:",
                    choices: roles.map((role) => ({
                      value: role.id,
                      name: role.title,
                    })),
                    name: "role_id",
                  },
                  {
                    type: "list",
                    message: "Please select the manager for this employee:",
                    choices: employees.map((employee) => ({
                      value: employee.id,
                      name: employee.last_name,
                    })),
                    name: "manager_id",
                  },
                ])
                .then((answer) => {
                  connection.query(
                    "INSERT INTO employees SET ?",
                    {
                      first_name: answer.first_name,
                      last_name: answer.last_name,
                      role_id: answer.role_id,
                      manager_id: answer.manager_id,
                    },
                    (err) => {
                      if (err) throw err;
                      console.log("Successfully added employee!");
                      //view the roles
                      inquireQ();
                    }
                  );
                });
            });
          });
          break;

        case "Remove Employee":
          connection.query("SELECT * FROM employees", (err, employees) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "list",
                  message:
                    "Please select the employee you would like to remove.",
                  choices: employees.map((employees) => ({
                    value: employees.id,
                    name: employees.last_name,
                  })),

                  name: "removeEmployee",
                },
              ])
              .then((answer) => {
                connection.query(
                  "DELETE FROM employees WHERE id=? ",
                  [answer.removeEmployee],
                  (err, res) => {
                    if (err) throw err;
                    connection.query("SELECT * FROM employees", (err, res) => {
                      if (err) throw err;
                      res.length > 0 && console.table(res);
                      inquireQ();
                    });
                  }
                );
              });
          });

          break;

        case "Updated Employee Roles":
          connection.query("SELECT * FROM employees", (err, employees) => {
            if (err) throw err;
            connection.query("SELECT * FROM roles", (err, roles) => {
              if (err) throw err;
              //joining
              connection.query(
                "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id",
                (err, res) => {
                  if (err) throw err;
                  printTable(res);
                  ask
                    .prompt([
                      {
                        type: "list",
                        message:
                          "Please select the employee you wish to update:",
                        choices: employees.map((employee) => ({
                          value: employee.id,
                          name: employee.last_name,
                        })),
                        name: "updateID",
                      },
                      {
                        type: "list",
                        message: "Please enter their new role id:",
                        choices: roles.map((role) => ({
                          value: role.id,
                          name: role.title,
                        })),
                        name: "updateRoleID",
                      },
                    ])
                    .then((answer) => {
                      connection.query(
                        "UPDATE employees SET ? WHERE ?",
                        [
                          {
                            role_id: answer.updateRoleID,
                          },
                          {
                            id: answer.updateID,
                          },
                        ],
                        (err, res) => {
                          if (err) throw err;
                          console.log("Successfully updated!");
                          inquireQ();
                        }
                      );
                    });
                }
              );
            });
          });
          break;

        case "View Employees by Manager":
          connection.query("SELECT * FROM employees ", (err, employees) => {
            ask
              .prompt({
                type: "list",
                message: "Please select the manager:",
                choices: employees.map((employees) => ({
                  value: employees.id,
                  name: employees.last_name,
                })),
                name: "viewMngrsEmps",
              })
              .then((answer) => {
                connection.query(
                  "SELECT * FROM employees WHERE ?",
                  [
                    {
                      manager_id: answer.viewMngrsEmps,
                    },
                  ],
                  (err, res) => {
                    if (err) throw err;
                    printTable(res);
                    inquireQ();
                  }
                );
              });
          });
          break;

        case "Update Employee Managers":
          connection.query("SELECT * FROM employees", (err, employees) => {
            if (err) throw err;
            res.length > 0 && console.table(res);
            ask
              .prompt([
                {
                  type: "list",
                  message:
                    "Please select the employee you would like to update:",
                  choices: employees.map((employees) => ({
                    value: employees.id,
                    name: employees.last_name,
                  })),
                  name: "updateMngr",
                },
                {
                  type: "list",
                  message: "Please select the new Manager",
                  choices: employees.map((employees) => ({
                    value: employees.id,
                    name: employees.last_name,
                  })),

                  name: "updateMngrID",
                },
              ])
              .then((answer) => {
                connection.query(
                  "UPDATE employees SET ? WHERE ?",
                  [
                    {
                      manager_id: answer.updateMngrID,
                    },
                    {
                      id: answer.updateMngr,
                    },
                  ],
                  (err, res) => {
                    if (err) throw err;
                    console.log("Employee's manager has been updated!");
                    inquireQ();
                  }
                );
              });
          });
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
