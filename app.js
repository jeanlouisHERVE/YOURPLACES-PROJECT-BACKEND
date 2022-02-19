const fs = require('fs'); // allow to interract with files and also to delete them
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route');
const HttpError = require('./models/http-error');
const { append } = require('express/lib/response');

const app = express()

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// to resolve any CORS problem
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next()
})
app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError ('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, () => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred !!!'})
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.abqdr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5000) 
    })
    .catch(err => {
        console.log(err);
    })
