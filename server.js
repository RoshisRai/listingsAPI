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

const HTTP_PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())


const db = new listingsDB();

app.get('/', (req, res)=> {
    res.send({message: "API Listening"})
})

app.post('/api/listings', (req, res) => {
    db.addListing(req.body).then((listing) => {
        res.status(201).json(listing);
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
})

app.get('/api/listings', (req, res) => {
    const { page, perPage, name } = req.query;
    db.getAllListings(page, perPage, name).then((listings) => {
        res.json(listings);
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
})

app.get('/api/listings/:id', (req, res) => {
    db.getListingById(req.params.id).then((listing) => {
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({error: "Listing not found"});
        }
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
})

app.put('/api/listings/:id', (req, res) => {
    db.updateListingById(req.params.id, req.body).then((listing) => {
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({error: "Listing not found"});
        }
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
})

app.delete('/api/listings/:id', (req, res) => {
    db.deleteListingById(req.params.id).then(() => {
        res.status(204).end();
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
})

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`)
        })
    }).catch((err) => {
        console.log(err)
    })