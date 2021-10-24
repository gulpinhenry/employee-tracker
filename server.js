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
    // SELECT roles.id as "Role ID", roles.title as Position, roles.salary AS Salary FROM roles;
    //  SELECT department.department_name AS Department FROM roles JOIN department ON roles.department_id = department.id;
    // SELECT roles.id as "Role ID", roles.title as Position, roles.salary AS Salary, department.name AS department FROM roles;
    //  SELECT department.department_name AS Department FROM roles JOIN department ON roles.department_id = department.id;
    // let query = `SELECT id as "Role ID", title as Position, salary, department.department_name AS 
    // Department FROM roles JOIN department ON roles.department_id = department.id FROM roles;` 
    let query = `SELECT roles.id as "Role ID", roles.title as Position, roles.salary AS Salary, department.department_name AS Department FROM roles JOIN department ON roles.department_id = department.id;`;
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong!");
            return;
        }
        console.table(res);
        transition();
    });
}
function viewEmployees(){

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

