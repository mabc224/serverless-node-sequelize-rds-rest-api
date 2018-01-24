"use strict";

let db = require('./config/db');
let order = require('./models/order')(db.sequelize, db.Sequelize);

module.exports.get = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    order.findOne({ where: { tenantId: event.pathParameters.id, sysState: 'open' }, raw: true }).then((order) => {
        console.log(order);
        const response = {
            statusCode: 200,
            headers: jsonResponseHeaders,
            body: JSON.stringify(order),
        };
        callback(null, response);
    }).catch(function(error) {
        console.error(error);
        callback(null, {
            statusCode: 501,
            headers: textResponseHeaders,
            body: "Couldn't find the order, Error finding from DB, Error: " + error
        });
    });
};