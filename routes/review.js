const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const {isLoggedIn, isAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");
const review = require("../models/review.js");

//server side form-validation of reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.postReview));

//Delete route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(ReviewController.deleteReview));


module.exports = router;