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

function viewDepartments(){
    let query = "SELECT * FROM department;";
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong!");
            return;
        }
        console.log(res);
        mainMenu();
    });
}
function viewRoles(){

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
    }).catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
        console.log("done");  
    })
}
//console.log("done");

