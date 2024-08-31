const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "defaultimage",
        },
        url: {
            type: String,
            default: "https://unsplash.com/photos/cloudy-sky-80sv993lUKI",
            // set: (v) => v === " " ? "https://unsplash.com/photos/cloudy-sky-80sv993lUKI" : v,
        },
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
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;