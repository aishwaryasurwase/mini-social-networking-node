const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const postRoutes = require('../routes/post_route');

const mongoose = require('mongoose');

var corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
};


// app.use('/', (req, res) => {
mongoose.connect("mongodb+srv://aishwarya:AukatMeReh@710@cluster0.lunhg.mongodb.net/test",
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("Connected to database");
        // res.status(200).json({ message: 'Connected to database' });
    }).catch((err) => {
        console.log("Error in connecting to database");
        // res.status(400).json({ message: 'Error in connecting to database' });
    })
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')))
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     req.setHeader("Access-Control-Allow-Origin", "*");
//     req.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
//     req.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
//     next();
// })
app.use(postRoutes);
module.exports = app;

// factorial
// Prime
// range 2 to 10 prime number 
