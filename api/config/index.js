const publicRoutes = require('./routes/publicRoutes');
const privateRoutes = require('./routes/privateRoutes');
const env = require('./env.json');

const nodeEnv = process.env.NODE_ENV || 'development';
module.exports = {
  keep: false,
  publicRoutes,
  privateRoutes,
  env: env[nodeEnv],
};
