const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingControllers = require("../controllers/listing.js");

router.route("/")
    .get(wrapAsync(ListingControllers.index)) //index route
    .post(isLoggedIn, validateListing, wrapAsync(ListingControllers.createListings)); //create route

router.get("/new", isLoggedIn, ListingControllers.renderNewForms); //new route

router.route("/:id")
    .get(wrapAsync(ListingControllers.showListings)) //show route
    .put(isLoggedIn, isOwner, wrapAsync(ListingControllers.updateListings)) //update route
    .delete(isLoggedIn, wrapAsync(ListingControllers.deleteListings)); //delete route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingControllers.editListings)); //edit route

module.exports = router;
