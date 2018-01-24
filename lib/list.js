"use strict";

let db = require('./config/db.js');
let order = require('./models/order')(db.sequelize, db.Sequelize);

module.exports.list = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    if (event.queryStringParameters) {
        if (!event.queryStringParameters.hasOwnProperty('limit')) {
            event.queryStringParameters.limit = 10;
        }
        if (!event.queryStringParameters.hasOwnProperty('offset')) {
            event.queryStringParameters.offset = 0;
        }
    } else {
        event.queryStringParameters = {};
        event.queryStringParameters.limit = 10;
        event.queryStringParameters.offset = 0;
    }


    order.findAll({
            where: { sysState: 'open' },
            limit: event.queryStringParameters.limit || 10,
            offset: event.queryStringParameters.offset || 0
        }).then(function(order) {
            console.log(order);
            const response = {
                statusCode: 200,
                headers: jsonResponseHeaders,
                body: JSON.stringify(order),
            };
            callback(null, response);
        })
        .catch(error => {
            callback(null, {
                statusCode: 501,
                headers: textResponseHeaders,
                body: "Couldn't fetch the orders, Error finding from DB, Error: " + error
            });
        });
};