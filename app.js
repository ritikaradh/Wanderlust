const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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