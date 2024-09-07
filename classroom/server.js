const express = require("express");
const app = express();
const session = require("express-session");
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req,res)=>{
    let { name = "anonymous"} = req.query;
    req.session.name = name;

    if(name === "anonymous") {
        req.flash("error", "user not registered");
    }else{
        req.flash("success", "user registered successfully");
    }
    
    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name, msg: req.flash("success")});
});

app.get("/reqcount", (req,res)=>{
    if(req.session.count) {
        req.session.count++;
    }else{
        res.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
});

app.get("/test", (req,res)=>{
    res.send("test successful");
});

app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
});