'use strict';

var Sequelize = require('sequelize');
var db_mode = process.env.NODE_ENV || 'development';
var env = require('./env.json')[db_mode];
var db = {};

var sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    port: env.port,
    logging: true, // Disable the logging. It is consuming the time on lambda function.
    dialect: env.dialect,
    define: {
        timestamps: false
    },
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 20000,
        idle: 10000
    }
});

module.exports = {
    'Sequelize': Sequelize,
    'sequelize': sequelize
};