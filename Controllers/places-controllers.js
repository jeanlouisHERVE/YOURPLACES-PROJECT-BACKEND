const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../Util/location');
const Place = require('../models/place');
const { add } = require('nodemon/lib/rules');

let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place) {
       throw new HttpError('Could not find a place for the provided id', 404)
    }

    res.json({place});
}

const getPlacesByUserId =  (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if(!places || places.length === 0) {
        return next (
            new HttpError ('Could not find places for the provided user id', 404)
        );
    } 

    res.json({places}); 
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // res.status(422)
        next(new HttpError('invalid inputs passed, please check your data', 422))
    }

    const {title, description, address, creator} = req.body;

    let coordinates;
    try {
        coordinates= await getCoordsForAddress(address);
    } catch (error) {
        return next(error); 
    }
   
    //const title = req.body.title
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://img1.bonnesimages.com/bi/bonjour/bonjour_136.jpg',
        creator
    });

    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
          'Creating place failed, please try again',
          500 
        );
        return next(error);
    };

    res.status(201).json({place: createdPlace})
}

const updatePlaceById = (req, res, next) => {
    const {title, description} = req.body;
    const placeId = req.params.pid;

    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    
    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place : updatedPlace})
};

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    if (DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a place for that id', 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: 'Deleted place.'})
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;