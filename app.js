const express = require('express');
const bodyparser = require('body-parser');

const placesRoutes = require('./routes/places-route');

const app = express()

app.use('/api/places', placesRoutes) // => /api/places...


app.listen(5000)