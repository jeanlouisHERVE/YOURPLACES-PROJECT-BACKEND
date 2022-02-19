const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (res, req, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentification failed')
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {userId: decodedToken.userId}
        next(); 
    } catch (err) {
   
        const error = new HttpError('Authentification failed', 401);
        return next(error);
    }
};