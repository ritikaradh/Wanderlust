const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

require('dotenv').config();
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

main()
    .then(()=>{
        console.log("Connection Successful!");
    })
    .catch((err)=>{
        console.log("error occured: ", err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//function to get coordinates for each listing
async function addCoordinatesToListings(listings) {
    for (let listing of listings) {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: `${listing.location}, ${listing.country}`,
            limit: 1,
          })
          .send();
  
        listing.geometry = {
          type: "Point",
          coordinates: response.body.features[0].geometry.coordinates,
        };
      } catch (error) {
        console.error(`Error fetching coordinates for ${listing.title}:`, error.message);
      }
    }
    return listings;
  }

const initDB = async() => {
    await Listing.deleteMany({}); 
    initData.data = initData.data.map((obj) => ({...obj, owner: "66e68f9920c416bb61134c53"})) ;  
    await addCoordinatesToListings(initData.data);
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
}

initDB();