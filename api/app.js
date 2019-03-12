const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mapRoutes = require('express-routes-mapper');

const config = require('./config');
const auth = require('./policies/auth.policy');

const app = express();
mongoose.connect(
  config.env.DB || process.env.MONGODB_URI,
  { useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) console.log(err);
  },
);
mongoose.Promise = global.Promise;
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');

app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  }),
);

app.use(bodyParser.json());

app.all('/private/*', (req, res, next) => auth(req, res, next));

app.use('/public', mappedOpenRoutes);
app.get('/public/docs', (req, res) => {
  res.redirect(
    'https://app.swaggerhub.com/apis/geofrocker/sms-mgt-api/1.0.0',
  );
});
app.use('/private', mappedAuthRoutes);
app.all('*', (req, res) => {
  res
    .status(404)
    .send({
      message:
        'This endpoint does not exist. Please refer to the docs by visiting https://glowing-umbrella.herokuapp.com/public/docs',
    });
});

module.exports = app;
