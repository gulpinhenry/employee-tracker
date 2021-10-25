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
function getDepartment(){
    let query = `SELECT * FROM department`;
    return db.promise().query(query);
        //console.log(res);
        //return (res.map(({ department_name, id }) => ({ name: department_name, value: id })));
    //}).then((response)=>{

   // });
}

function getRoles(){
    let query = `SELECT * FROM roles`;
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong!");
        }
        return(res.map(({ title, id }) => ({ name: title, value: id })));
    })
    
}
function getEmployees(){
    let query = `SELECT * FROM employee`;
    db.query(query, (err, res)=>{
        if (err) {
            console.error("Oops! Something went wrong");
        }
        console.log(res);
        return(res.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id })));
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
    inquirer.prompt({
        name: "dep",
        type: "input",
        message: "Add a new department",
    })
    .then((res) => {
        if(res.dep){
            let query = `
            INSERT INTO department(department_name)
            VALUES
            ("${res.dep}")`;
            db.query(query, (err)=>{
                if (err) {
                    console.error("Oops! Something went wrong!");
                }
                else{
                    console.log("\n\n" + res.dep + " has been added successfully")
                }
            });
        }
        else{
            console.log("\n Something went wrong. Please try again\n\n");
        }
        transition();
    })
}

//TO DO figure out the synchronous
async function addRole(){
    let res = await getDepartment()
    let depArr = res.map(({ department_name, id }) => ({ name: department_name, value: id }));
    console.log(depArr);
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Add a new role",
        },
        {
            name: "salary",
            type: "input",
            message: "Add a salary (USD)",
            validate: (input)=>{
                if(!isNaN(input))
                    return true;
                else
                {
                    console.log("\n Please enter a proper salary");
                    return false;
                }
            }
        },
        {
            name: "dep",
            type: "list",
            message: "Select department",
            choices: depArr
        }
    ])
    .then((res) => {

        let query = `
        INSERT INTO roles(title, salary, department_id)
        VALUES
        ("${res.title}", ${res.salary}, ${res.dep})`;
        db.query(query, (err)=>{
            if (err) {
                console.error("Oops! Something went wrong!");
            }
            else{
                console.log("\n\n" + res.title + " has been added successfully")
            }
            transition();
        });  
    })
    
}

// TO DO figure out the asynchronous
function addEmployee(){
    let rolArr = getRoles();
    let manArr = getEmployees();
    console.log(rolArr);
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "First name:",
        },
        {
            name: "last",
            type: "input",
            message: "Last name:",
        },
        {
            name: "role",
            type: "list",
            message: "Role:",
            choices: rolArr
        },
        {
            name: "wantManager",
            type: "confirm",
            message: "Add a manager?"
        },
        {
            when: (input) => input.wantManager,
            name: "manager",
            type: "list",
            message: "Manager:",
            choices: manArr,
            default: null
        }
    ])
    .then((res) => {

        let query = `
        INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES
        ("${res.first}", "${res.last}", ${res.role}, ${res.manager})`;
        db.query(query, (err)=>{
            if (err) {
                console.error("Error adding employee");
            }
            else{
                console.log("\n\n" + res.title + " has been added successfully")
            }
            transition();
        });  
    })
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

