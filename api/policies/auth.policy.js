/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const config = require('../config/');

module.exports = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    return jwt.verify(req.token, config.env.SECRET_KEY, (err, authData) => {
      if (err) {
        return res.status(403).send({ message: 'You are not authenticated or token is invalid' });
      }
      req.userId = authData.user._id;
      req.username = authData.user.username;
      req.email = authData.user.email;
      return next();
    });
  }
  return res.status(403).send({ message: 'You are not authenticated' });
};
