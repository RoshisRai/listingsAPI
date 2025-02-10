const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    _id: String,
    listing_url: String,
    name: String,
    room_type: String,
    address: {
        street: String
    },
    summary: String,
    accommodates: Number,
    number_of_reviews: Number,
    review_scores: {
        review_scores_rating: Number
    },
    images: {
        picture_url: String
    },
    neighborhood_overview: String,
    price: String,
    bed_type: String,
    beds: Number
}, {
    collection: 'listingsAndReviews'
})

const listingModel = mongoose.model('listing', listingSchema);

module.exports = listingModel;