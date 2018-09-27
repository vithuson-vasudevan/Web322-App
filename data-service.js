//global variables
var employees = [];
var departments = [];
var managers = [];

function initialize(){
    const fs = require('fs');
    return new Promise(function (resolve, reject) {
        //initialize array for employees.json
        fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if(err) reject('Unable to read file.');
            else 
            {
                //const obj = JSON.parse(data);
                employees = JSON.parse(data);
                resolve('Employees array populated.');
            }
        });
        //initialize array for departments.json
        fs.readFile('./data/departments.json', 'utf8', (err, data) => {
            if(err) reject('Error: Unable to read file.');
            else 
            {
                //const obj = JSON.parse(data);
                departments = JSON.parse(data);
                resolve('Departments array populated.');
            }
        });
    });    
}
//this function promises to return employees info
function getAllEmployees(){
    return new Promise(function (resolve, reject) {
        if(employees.length == 0)
        {
            reject('No results returned.');
        }
        else {
            resolve(employees);
        }
    });    
}
//this function promises to return manager info
function getManagers(){
    return new Promise(function (resolve, reject) {
        if(employees.length == 0)
        {
            reject('No results returned.');
        }
        else 
        {
            // foreach(employees, (employee) => {
            //     if (employee.isManager) { 
            //          managers.push(employee);
            //     }
            // })
            // resolve(managers);

            for(var i = 0; i < employees.length; i++){
                if(employees[i].isManager === true) {
                    //console.log(employee);
                    managers.push(employees[i]);
                }
            }
            resolve(managers);
        }        
    });
}
//this function promises to return departments info
function getDepartments(){
    return new Promise(function (resolve, reject){
        if(departments.length == 0) {
            reject('No results returned.');
        }
        else 
        {
            resolve(departments);
        }     
    });
}
//add employees function
function addEmployee(employeeData){
    return new Promise(function (resolve, reject){
        //solve problem if checkbox is unchecked
        if(!employeeData.isManager) employeeData.isManager = false;
        else employeeData.isManager = true;
        //insert data after the last data in the array
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        //resolve it
        resolve(employees);
    });
}

//get employees by status
function getEmployeesByStatus(status) {
    var statusArray = [];
    return new Promise(function (resolve, reject) {
        for(var i = 0; i < employees.length; i++) {
            if(employees[i].status === status) {
                statusArray.push(employees[i]);
            }
        }
        resolve(statusArray);
        if(statusArray.length == 0) {
            reject('No results returned.');
        }   
    });
}
//get employee by num
function getEmployeeByNum(num) {
    return new Promise(function (resolve, reject) {
        resolve(employees[num - 1]);
        //check reject
        if(employees.length == 0) {
            reject('No results returned.');
        }
    });
}
//get employee by department
function getEmployeesByDepartment(department) {
    employee = [];
    return new Promise(function (resolve, reject) {
        for(var i = 0; i < employees.length; i++) {
            if(employees[i].department == department) {
                employee.push(employees[i]);
            }
        }
        resolve(employee);
        //reject
        if(employee.length == 0) {
            reject('No results returned.');
        }
    });
}
//get employee by manager
function getEmployeesByManager(manager) {
    employeeManagerNum = [];
    return new Promise(function (resolve, reject) {
        for(var i = 0; i < employees.length; i++) {
            if(employees[i].employeeManagerNum == manager) {
                employeeManagerNum.push(employees[i]);
            }
        }
        resolve(employeeManagerNum);

        if(employeeManagerNum.length != 0) {
            reject('No results returned.');
        }
    });
}
//update employee data
function updateEmployee(employeeData) {
    return new Promise(function (resolve, reject) {
        for(var i = 0; i < employees.length; i++) {
            if(employees[i].employeeNum == employeeData.employeeNum) {
                employees[i].firstName = employeeData.firstName;
                employees[i].lastName = employeeData.lastName;
                employees[i].email = employeeData.email;
                employees[i].addressStreet = employeeData.addressStreet;
                employees[i].addresCity = employeeData.addresCity;
                employees[i].addressState = employeeData.addressState;
                employees[i].addressPostal = employeeData.addressPostal;
                employees[i].isManager = employeeData.isManager;
                employees[i].employeeManagerNum = employeeData.employeeManagerNum;
                employees[i].status = employeeData.status;
                employees[i].department = employeeData.department;
            }
        }
        resolve();
    });
}
//export modules
module.exports = {
    initialize: initialize,
    getAllEmployees: getAllEmployees,
    getManagers: getManagers,
    getDepartments: getDepartments,
    addEmployee: addEmployee,
    getEmployeesByStatus: getEmployeesByStatus,
    getEmployeeByNum: getEmployeeByNum,
    getEmployeesByDepartment: getEmployeesByDepartment,
    getEmployeesByManager: getEmployeesByManager,
    updateEmployee: updateEmployee
};