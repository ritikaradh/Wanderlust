const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs", {allListings});
};

module.exports.renderNewForms = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",},});
    if(!listing){
        req.flash("error", "The listing has been deleted.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListings = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListings = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListings = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}