const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cookie = require("cookie-parser");
const ejs = require("ejs");
const multer = require("multer");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const expressValidator = require("express-validator");
const sweetalert = require("sweetalert2");
const http = require("https");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(cookie());


mongoose.set("strictQuery", false);


main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb+srv://admin-naveen:Kkavn425@cluster0.hvrkrmt.mongodb.net/health-hist");
	console.log("Connected");
}


const loginSchema = {
    email : String,
    password : String
}

const logindetail = new mongoose.model("logindetail",loginSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/Dashboard",function(req,res){
    res.render("Dashboard",{
        name : "NIL",
        email : "NIL",
        phone : "NIL",
        date : "NIL",
        time : "NIL"
    });
});

app.get("/SignUp",function(req,res){
    res.render("SignUp",{passcode : ""});
});

app.post("/SignUp",function(req,res){
    const email2 = req.body.email;
    const password2 = req.body.password;
    const re_password = req.body.re_password;
    // console.log(email);
    logindetail.findOne({email : email2},function(err,foundemail){
        if(!err){
            if(!foundemail){
                if(password2 != re_password){
                    res.render("SignUp",{passcode : "Password and re-password are not same"});
                }
                else{
                    const email1 = new logindetail({
                        email : email2,
                        password : password2,
                    });
                    // const email1 = new logindetail(email);
                    email1.save();
                    console.log(email2);
                    res.redirect("/LogIn");
                }
            }
            else{
                // console.log(email);
                res.redirect("/LogIn");
            }
        }
        else{
            console.log(err);
        }
    })
});
app.get("/LogIn",function(req,res){
    res.render("LogIn");
});

app.post("/LogIn",function(req,res){
    const email2 = req.body.email;
    const password2 = req.body.password;
    logindetail.findOne({email : email2},function(err,foundemail){
        if(!err){
            if(!foundemail){
                res.render("SignUp", {passcode : ""});
            }
            else{
                if(foundemail.password === password2) {
                    res.redirect("/Dashboard");
                }
                else{
                    res.render("SignUp", {passcode : ""});
                }
            }
        }
        else{
            console.log(err);
        }
    })
})


app.get("/",function(req,res){
    res.render("home");
});



app.get("/Department",function(req,res){
    res.render("Department");
});

app.get("/Employees",function(req,res){
    res.render("Employees");
});

app.get("/Appointment",function(req,res){
    res.render("Appointment");
});


const appoiDetail = {
    name : String,
    phone : String,
    email : String,
    date : Date,
    time : String,
    complain : String
}

const appointment_detail = new mongoose.model("appointment_detail", appoiDetail);

app.post("/Appointment", function(req,res){
    const fullname = req.body.full_name;
    const phone = req.body.phone;
    const email = req.body.email;
    const date = req.body.appintment_date;
    const time = req.body.timing;
    const symptoms = req.body.diseases;

    appointment_detail.findOne({email : email}, function(err,founddetail){
        if(!err){
                const detail1 = new appointment_detail({
                    name : fullname,
                    phone : phone,
                    email : email,
                    date : date,
                    time : time,
                    complain : symptoms
                });
                detail1.save();
                console.log("app");
                res.render("Dashboard",{
                    name : fullname,
                    phone : phone,
                    email : email,
                    date : date,
                    time : time,
                });
        }
        else{
            console.log(err);
        }
    })

})
const PORT = process.env.PORT || 3000 ;
app.listen(PORT,function(req,res){
    console.log(`port ok on ${PORT}`);
});
