const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

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

const initDB = async() => {
    await Listing.deleteMany({}); 
    initData.data = initData.data.map((obj) => ({...obj, owner: "66e68f9920c416bb61134c53"})) ;  
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
}

initDB();