const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
          lat: 40.7484474,
          lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.id;

    const place = DUMMY_PLACES.find(p => {
        return p.pid === placeId;
    });
    res.json({ place }); //=> {place } === { place : place}
}) 

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    console.log(userId)
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });
    console.log(place)
    res.json({place}); 
}) 

module.exports = router; 