const express = require("express");
const engine = require('ejs-mate');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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



app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

// app.get("/testlisting", async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "Beach Villa",
//         description: "Beach-view villa",
//         price: 2000000,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved!");
//     res.send("successful testing");
// });

//index route
app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs", {allListings});
}));

//new route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", wrapAsync(async(req, res, next) => {

        if(!req.body.listing){
            throw new ExpressError(400,"Send valid data for listing.");
        }
    
        const newListing = new Listing(req.body.listing);

        if(!newListing.title){
            throw new ExpressError(400, "Title is missing");
        }

        if(!newListing.description){
            throw new ExpressError(400, "Description is missing");
        }

        if(!newListing.location){
            throw new ExpressError(400, "Location is missing");
        }

        if(!newListing.country){
            throw new ExpressError(400, "Country is missing");
        }

        if(!newListing.price){
            throw new ExpressError(400, "Price is missing");
        }

        await newListing.save();
        res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

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