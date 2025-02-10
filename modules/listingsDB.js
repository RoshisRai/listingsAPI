const mongoose = require('mongoose');
const Listing = require('./listingSchema');

class ListingsDB {
    async initialize(connectionString) {
        try {
            await mongoose.connect(connectionString);

            //Verify connection to the correct database
            const db = mongoose.connection;
            console.log(`Connected to database: ${db.name}`);
            
            //Verify we can access the listings collection
            const collections = await db.db.listCollections().toArray();
            const hasListings = collections.some(col => col.name === 'listingsAndReviews');

            if (!hasListings) {
                throw new Error('listingsAndReviews collection not found');
            }
            console.log("Database connection successful");
            return true;
        } catch (err) {
            console.error("Database connection error:", err);
            throw err;
        }
    }

    async addListing(listing) {
        try {
            const newListing = new Listing(listing);
            return await newListing.save();
        } catch (err) {
            throw err;
        }
    }

    async getAllListings(page, perPage, name) {
        try {
            let query = {};
            if (name) {
                query.name = { $regex: name, $options: 'i'};
            }

            const skip = (page - 1) * perPage;

            const listings = await Listing.find(query)
                .skip(skip)
                .limit(Number(perPage))
                .exec();

            console.log(`Retrieved ${listings.length} listings`);
            return listings;
        } catch (error) {
            throw error;    
        }
    }

    async getListingById(id) {
        try {
            return await Listing.findById(id).exec();
        } catch (err) {
            throw err;
        }
    }

    async updateListingById(id, listing) {
        try {
            return await Listing.findByIdAndUpdate(
                id,
                { $set: listing},
                { new: true}
            ).exec();
        } catch (err) {
            throw err;
        }
    }

    async deleteListingById(id) {
        try {
            const result = await Listing.findByIdAndDelete(id).exec();
            return !!result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ListingsDB;