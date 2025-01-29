class ListingsDB {
    async initialize(connectionString) {
        // To Simulate database initialization
        return true;
    }

    async addListing(listing) {
        // To Simulate adding a listing
        return listing;
    }

    async getAllListings(page, perPage, name) {
        // To Simulate getting all listings with pagination and optional name filter
        return [];
    }

    async getListingById(id) {
        // To Simulate getting a listing by ID
        return null;
    }

    async updateListingById(id, listing) {
        // To Simulate updating a listing by ID
        return listing;
    }

    async deleteListingById(id) {
        // To Simulate deleting a listing by ID
        return true;
    }
}

module.exports = ListingsDB;