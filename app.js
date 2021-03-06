const ask = require("inquirer");
const validator = require("validator");
const CFonts = require("cfonts");
const { printTable } = require("console-table-printer");
const util = require("util");
const connection = require("./db/connection");
const compression = require("compression");
const express = require("express");
const app = express();

app.use(compression());

connection.query = util.promisify(connection.query);

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  inquireQ();
});

// main function
const inquireQ = async () => {
  const res = await ask.prompt([
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
        "View Budget by Department",
        "Finish",
      ],
      name: "userFunction",
    },
  ]);

  try {
    const userFunction = res.userFunction;
    // switch case for all options
    switch (userFunction) {
      // ====== ADD DEPARTMENT========
      case "Add Department":
        const { department } = await ask.prompt({
          type: "input",
          message: "Please enter the department you wish to add:",
          name: "department",
          validate: (value) => {
            if (validator.isAlpha(value)) {
              return true;
            }
            return "Please enter a valid department (a-z)";
          },
        });

        await connection.query("INSERT INTO departments SET ?", {
          name: department,
        });
        console.log("Successfully added department!");
        const showDpt = await connection.query("SELECT * FROM departments");
        printTable(showDpt);
        inquireQ();
        break;

      // ======= VIEW DEPARTMENTS=========
      case "View Departments":
        const viewDpt = await connection.query("SELECT * FROM departments");
        printTable(viewDpt);
        inquireQ();
        break;

      // ====== DELETE DEPARTMENT=======
      case "Delete Departments":
        const dept2 = await connection.query("SELECT * FROM departments ");
        printTable(dept2);
        const { deleteDept } = await ask.prompt([
          {
            type: "list",
            message: "Select the department you would like to delete.",
            choices: dept2.map((dept2) => ({
              value: dept2.id,
              name: dept2.name,
            })),
            name: "deleteDept",
          },
        ]);

        await connection.query("DELETE FROM departments WHERE id=? ", [
          deleteDept,
        ]);

        const viewRemain = await connection.query("SELECT * FROM departments");
        printTable(viewRemain);
        inquireQ();

        break;

      // ===== ADD ROLE======
      case "Add Role":
        const dept1 = await connection.query("SELECT * FROM departments");
        const roleAdd = await ask.prompt([
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
            choices: dept1.map((department) => ({
              value: department.id,
              name: department.name,
            })),
            name: "department_id",
          },
        ]);
        await connection.query("INSERT INTO roles SET ?", {
          title: roleAdd.title,
          salary: roleAdd.salary,
          department_id: roleAdd.department_id,
        });
        console.log("Successfully added role!");
        const addRole = await connection.query(
          "SELECT roles.id, roles.title, departments.name AS departments FROM roles INNER JOIN departments ON roles.department_id= departments.id"
        );
        printTable(addRole);
        inquireQ();

        break;

      // ====VIEW ROLES======
      case "View Roles":
        const viewRoles = await connection.query(
          "SELECT  roles.id, roles.title, roles.salary, departments.name AS departments FROM roles INNER JOIN departments ON roles.department_id= departments.id"
        );
        printTable(viewRoles);
        inquireQ();

        break;

      // ====DELETE ROLES====
      case "Delete Roles":
        const role = await connection.query("SELECT * FROM roles ");
        printTable(role);
        const { deleteRole } = await ask.prompt([
          {
            type: "list",
            message: "Please select the role you wish to delete:",
            choices: role.map((role) => ({
              value: role.id,
              name: role.title,
            })),
            name: "deleteRole",
          },
        ]);

        await connection.query("DELETE FROM roles WHERE id=? ", [deleteRole]);
        const viewChange = await connection.query("SELECT * FROM roles");

        printTable(viewChange);
        inquireQ();
        break;

      // ======ADD EMPLOYEE=====
      case "Add Employee":
        const roles = await connection.query("SELECT * FROM roles");
        const employees = await connection.query("SELECT * FROM employees");
        const employeeChoices = employees.map((employee) => ({
          value: employee.id,
          name: employee.last_name,
        }));

        employeeChoices.push({ value: null, name: "None" });

        const addEmp = await ask.prompt([
          {
            type: "input",
            message: "Please enter employee's first name:",
            name: "first_name",
          },
          {
            type: "input",
            message: "Please enter employee's last name:",
            name: "last_name",
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
            choices: employeeChoices,
            name: "manager_id",
          },
        ]);
        await connection.query("INSERT INTO employees SET ?", {
          first_name: addEmp.first_name,
          last_name: addEmp.last_name,
          role_id: addEmp.role_id,
          manager_id: addEmp.manager_id,
        });
        console.log("Successfully added employee!");
        const viewRes = await connection.query(
          "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id"
        );
        printTable(viewRes);
        inquireQ();
        break;
      // ==== VIEW EMPLOYEES=====
      case "View Employees":
        const see = await connection.query(
          "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id"
        );
        printTable(see);
        inquireQ();
        break;

      // ======= REMOVE EMPLOYEE=======
      case "Remove Employee":
        const emp = await connection.query("SELECT * FROM employees");
        const { removeEmployee } = await ask.prompt({
          type: "list",
          message: "Please select the employee you would like to remove.",
          choices: emp.map((emp) => ({
            value: emp.id,
            name: emp.last_name,
          })),
          name: "removeEmployee",
        });
        await connection.query("DELETE FROM employees WHERE id=? ", [
          removeEmployee,
        ]);
        const viewEmpsLeft = await connection.query("SELECT * FROM employees");
        printTable(viewEmpsLeft);
        inquireQ();
        break;

      // ===== UPDATED EMPLOYEE ROLES=======
      case "Updated Employee Roles":
        const emps2 = await connection.query("SELECT * FROM employees");
        const roles2 = await connection.query("SELECT * FROM roles");
        const joinQ = await ask.prompt([
          {
            type: "list",
            message: "Please select the employee you wish to update:",
            choices: emps2.map((employee) => ({
              value: employee.id,
              name: employee.last_name,
            })),
            name: "updateID",
          },
          {
            type: "list",
            message: "Please enter their new role id:",
            choices: roles2.map((role) => ({
              value: role.id,
              name: role.title,
            })),
            name: "updateRoleID",
          },
        ]);
        await connection.query("UPDATE employees SET ? WHERE ?", [
          {
            role_id: joinQ.updateRoleID,
          },
          {
            id: joinQ.updateID,
          },
        ]);
        const join1 = await connection.query(
          "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id"
        );
        printTable(join1);
        console.log("Successfully updated!");
        inquireQ();

        break;

      // ====== VIEW EMPLOYEES BY MANAGER=======
      case "View Employees by Manager":
        const seeEmp = await connection.query(
          "SELECT employees.id, employees.first_name, employees.last_name, manager_id, roles.title AS role_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id "
        );
        printTable(seeEmp);
        const { viewMngrsEmps } = await ask.prompt({
          type: "list",
          message: "Please select the manager:",
          choices: seeEmp.map((employees) => ({
            value: employees.id,
            name: employees.last_name,
          })),
          name: "viewMngrsEmps",
        });

        const seeMgr = await connection.query(
          "SELECT * FROM employees WHERE ?",
          [
            {
              manager_id: viewMngrsEmps,
            },
          ]
        );

        if (seeMgr.length === 0) {
          console.log("No Employee under this Manager");
        } else {
          printTable(seeMgr);
        }

        inquireQ();

        break;

      // ===== UPDATE EMPLOYEE MANAGER=======
      case "Update Employee Managers":
        const joinEmp = await connection.query(
          "SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title AS role_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id"
        );
        printTable(joinEmp);
        const updateMngrs = await ask.prompt([
          {
            type: "list",
            message: "Please select the employee you would like to update:",
            choices: joinEmp.map((employees) => ({
              value: employees.id,
              name: employees.last_name,
            })),
            name: "updateMngr",
          },
          {
            type: "list",
            message: "Please select the new Manager",
            choices: joinEmp.map((employees) => ({
              value: employees.id,
              name: employees.last_name,
            })),

            name: "updateMngrID",
          },
        ]);
        await connection.query("UPDATE employees SET ? WHERE ?", [
          {
            manager_id: updateMngrs.updateMngrID,
          },
          {
            id: updateMngrs.updateMngr,
          },
        ]);
        console.log("Employee's manager has been updated!");

        inquireQ();

        break;

      // =======VIEW BUDGET BY DEPARTMENT======
      case "View Budget by Department":
        const budgetTime = await connection.query("SELECT * FROM departments");
        const { budget } = await ask.prompt({
          type: "list",
          message: "Please select the department's budget you wish to view",
          choices: budgetTime.map((department) => ({
            value: department.id,
            name: department.name,
          })),
          name: "budget",
        });
        const budgetDept = await connection.query(
          "SELECT departments.id, roles.title AS role_id, roles.salary, employees.last_name FROM departments INNER JOIN roles ON roles.department_id = departments.id INNER JOIN employees ON employees.role_id = roles.id WHERE departments.id=?",
          [budget]
        );
        printTable(budgetDept);
        let salary = budgetDept.reduce((sum, row) => sum + row.salary, 0);
        console.log(`This departments budget is ${salary}`);
        inquireQ();
        break;

      // =======FINISH======
      case "Finish":
        connection.end();
        break;
      default:
        break;
      //end of switch
    }
  } catch (err) {
    console.log(err);
  }
};

CFonts.say("Welcome to|Employee Checker", {
  font: "tiny",
  align: "center",
  colors: ["candy"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
  gradient: true,
  independentGradient: false,
  transitionGradient: false,
  env: "node",
});
