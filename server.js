/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Vithuson Vasudevan | Student ID: 012729133 | Date: March 18th, 2018
*
* Online (Heroku) Link: https://radiant-journey-46041.herokuapp.com/
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var multer = require("multer");
var path = require("path");
var fs = require("fs");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars"); 
var dataService = require("./data-service.js");
//var viewRoot = {root: '/Users/Vithu/Documents/web322/web322-app'};
//display to console what port is being used
console.log("Express http server listening on: " + HTTP_PORT)
//set up handlebars
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } 
            else {
                return options.fn(this);
            }
        }           
    }
}));
app.set('view engine', '.hbs');
//get URL paths to highlight appropriate menu item
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});   
//set the middleware for urlencoded
app.use(bodyParser.urlencoded({ extended: true}));
//set up routes to listen on the url paths
app.use(express.static('public'));
//root
app.get("/", (req, res) => {
    res.render('home');
});
//home page
app.get("/home", (req, res) => {
    res.render('home');
});
//about page
app.get("/about", (req, res) => {
    res.render('about');
});
//employees page
app.get("/employees", (req, res) => {
   
    var status = req.query.status;
    var department = req.query.department;
    var manager = req.query.manager;

    if(status == "Full Time" || status == "Part Time") {
        dataService.getEmployeesByStatus(status).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        });
    }

    if(department >= 1 && department <= 7) {
        dataService.getEmployeesByDepartment(department).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        });    
    }

    if(manager >= 1 && manager <= 30) {
        dataService.getEmployeesByManager(manager).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        });
    }

    dataService.getAllEmployees().then((data) => {
        res.render("employees", {employees: data});
    }).catch((err) => {
        res.render({message: "no results"});
    });

});
app.post("/employees/update", (req, res) => {
    dataService.updateEmployee(req.body).then((data) => {
        res.redirect("/employees");
    })  
});   
//managers page
// app.get("/managers", (req, res) => {
//     dataService.getManagers().then((data) => {
//         res.json(data);
//     }).catch((err) => {
//         res.send("{message: " + err + "}");
//     });
// });
//departments page
app.get("/departments", (req, res) => {
    dataService.getDepartments().then((data) => {
        res.render("departments", {departments: data}); 
    }).catch((err) => {
        res.send("{message: " + err + "}");
    });
});
//add employees page
app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
});
//add images page
app.get("/images/add", (req, res) => {
    res.render('addImage');
});

//setup http server to listen on HTTP_PORT
dataService.initialize().then(() => {
    app.listen(HTTP_PORT);
}).catch((err) => {
    console.log("Error: " + err);    
});

//define multer disk storage
var storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
//upload variable
var upload = multer({storage: storage});
//post route
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});
//get images
app.get("/images", (req, res) => {
    var path = "./public/images/uploaded";
    var images = [];
    fs.readdir(path, function(err, items) {
        res.render("images", {images: items});
    });
});
//post route
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.send("{message: " + err + "}");
    });
});
//employee/value route
app.get('/employees/:value', (req, res) => {
    var num = req.params.value;
    dataService.getEmployeeByNum(num).then((data) => {
        res.render("employee", {employee: data});
    }).catch((err) => {
        res.render({message: "no results"});
    });
});
//error page
app.use(function(req, res) {
    res.send("404: Page not Found", 404);
 });