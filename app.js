const express = require("express");
const engine = require("ejs-mate");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }, 
};

app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engine);

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));


main()
    .then(()=>{
        console.log("Database Connected!");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

//error handling middleware
app.use((err, req, res, next)=>{
    let {statusCode=500, message="something's not so good"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});