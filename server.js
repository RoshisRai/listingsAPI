/********************************************************************************
 *  WEB422 – Assignment 1
 *  
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *  
 *  Name: Roshis Rai Student ID: 116516238 Date: Jan 28, 2025
 *  Published URL: https://listings-api-roshis-rai.vercel.app/
 ********************************************************************************/

const express = require('express')
const cors = require('cors')
const listingsDB = require('./modules/listingsDB.js')
require('dotenv').config()

const HTTP_PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())


const db = new listingsDB();

app.get('/', (req, res)=> {
    res.send({message: "API Listening"})
})

// POST /api/listings
app.post('/api/listings', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({error: "Request body is missing or empty"});
    }

    db.addListing(req.body)
        .then((listing) => res.status(201).json(listing))
        .catch((err) => res.status(500).json({error: err.message}));
})

// GET /api/listings
app.get('/api/listings', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const name = req.query.name || "";

    if (page < 1 || perPage < 1) {
        return res.status(400).json({error: "Invalid page or perPage parameter"});
    }

    db.getAllListings(page, perPage, name)
        .then((listings) => res.json(listings))
        .catch((err) => res.status(500).json({error: err.message}));
})

// GET /api/listings/:id
app.get('/api/listings/:id', (req, res) => {
    db.getListingById(req.params.id)
        .then(listing => {
            if (!listing) {
                return res.status(404).json({ error: "Listing not found" });
            }
            res.json(listing);
        })
        .catch(err => res.status(500).json({ error: err.message }));
})

// PUT /api/listings/:id
app.put('/api/listings/:id', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body cannot be empty" });
    }
    db.updateListingById(req.params.id, req.body)
        .then(listing => {
            if (!listing) {
                return res.status(404).json({ error: "Listing not found" });
            }
            res.json(listing);
        })
        .catch(err => res.status(500).json({ error: err.message }));
})

// DELETE /api/listings/:id
app.delete('/api/listings/:id', (req, res) => {
    db.deleteListingById(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: "Listing not found" });
            }
            res.status(204).end();
        })
        .catch(err => res.status(500).json({ error: err.message }));
})

//Initialize database and start server
db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`)
        })
    }).catch((err) => {
        console.log(err)
    })

// Error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: "Something broke!"});
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
})