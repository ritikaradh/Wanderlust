const express = require("express");
const engine = require('ejs-mate');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engine);

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
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

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});

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
app.get("/listings", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs", {allListings});
});

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", async(req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
