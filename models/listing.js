const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    // image: {
    //     filename: {
    //         type: String,
    //         default: "defaultimage"
    //     },
    //     url: {
    //         type: String,
    //         default: "https://unsplash.com/photos/cloudy-sky-80sv993lUKI",
    //         set: (v) => v === " " ? "https://unsplash.com/photos/cloudy-sky-80sv993lUKI" : v,
    //     },
    // },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;