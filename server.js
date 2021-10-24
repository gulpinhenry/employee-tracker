const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const { allowedNodeEnvironmentFlags } = require("process");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password",
        database: "employee_db"
    },
    console.log('Connected to the employee database'),
    console.log(`
    
█▀▀ █▀▄▀█ █▀█ █░░ █▀█ █▄█ █▀▀ █▀▀   ▀█▀ █▀█ ▄▀█ █▀▀ █▄▀ █▀▀ █▀█
██▄ █░▀░█ █▀▀ █▄▄ █▄█ ░█░ ██▄ ██▄   ░█░ █▀▄ █▀█ █▄▄ █░█ ██▄ █▀▄`),
    mainMenu()
);

function transition(){
    inquirer.prompt({
        name: "continue",
        type: "confirm",
        message: "Continue?",
      })
      .then((res) => {
          if(res.continue){
              mainMenu();
              return;
          }
          else{
              console.log("\n Have a nice day.\n\n");
              process.exit();
          }
      })
}
function viewDepartments(){
    let query = "SELECT * FROM department;";
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong!");
            return;
        }
        console.table(res);
        transition();
    });
}
function viewRoles(){
    let query = `SELECT roles.id as "Role ID",
     roles.title as "Job Title", 
     roles.salary AS Salary, 
     department.department_name AS Department 
     FROM roles JOIN department ON roles.department_id = department.id;`;
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong!");
        }
        else{
            console.table(res);
        }
        transition();
    });
}

// TO DO
function viewEmployees(){
    // how to add manager name with id from the same table
    //"SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.role_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id;"
    /* SELECT 
        employee.first_name AS "First Name", 
        employee.last_name AS "Last Name", 
        department.department_name AS "Department", 
        roles.title AS "Position Title", 
        roles.salary AS "Salary"
        FROM employee 
        JOIN roles 
            ON employee.role_id = roles.id 
        JOIN department 
            ON roles.department_id = department.id;
     */
    let query = `SELECT 
    employee.first_name AS "First Name", 
    employee.last_name AS "Last Name", 
    department.department_name AS "Department", 
    roles.title AS "Position Title", 
    roles.salary AS "Salary"
    FROM employee 
    JOIN roles 
        ON employee.role_id = roles.id 
    JOIN department 
        ON roles.department_id = department.id;`;
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong!");
        }
        else{
            console.table(res);
        }
        transition();
    });
}
function addDepartment(){

}
function addRole(){

}
function addEmployee(){

}
function addDepartment(){

}
function updateRole(){

}

function mainMenu(){
    console.log("\n\n");
    inquirer.prompt({
      name: "main",
      type: "list",
      message: "What would you like to do?",
      loop: "false",
      choices: [
        "View departments",
        "View roles",
        "View employees",
        "Add department",
        "Add role",
        "Add employee",
        "Add department",
        "Update employee role",
        "Exit"
        // delete employee later
      ]
    })
    .then((res) => {

        switch (res.main) {
            case "View departments":
                viewDepartments();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View employees":
                viewEmployees();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Update employee role":
                updateRole();
                break;
            case "Exit":
                console.log("Have a nice day.\n\n");
                process.exit();
            default:
                break;
        }
        //mainMenu();
    })
}
//console.log("done");

