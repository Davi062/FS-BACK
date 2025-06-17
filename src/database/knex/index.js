const config = require('../../../knexfile');
const knex = require('knex');

// Use the development configuration from knexfile.js
const connection = knex(config.development);

module.exports = connection;
