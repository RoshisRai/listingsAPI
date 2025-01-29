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

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`)
        })
    }).catch((err) => {
        console.log(err)
    })