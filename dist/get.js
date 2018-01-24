"use strict";

var db = require('./config/db');
var order = require('./models/order')(db.sequelize, db.Sequelize);

module.exports.get = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    var textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    var jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    order.findOne({ where: { tenantId: event.pathParameters.id, sysState: 'open' }, raw: true }).then(function (order) {
        console.log(order);
        var response = {
            statusCode: 200,
            headers: jsonResponseHeaders,
            body: JSON.stringify(order)
        };
        callback(null, response);
    }).catch(function (error) {
        console.error(error);
        callback(null, {
            statusCode: 501,
            headers: textResponseHeaders,
            body: "Couldn't find the order, Error finding from DB, Error: " + error
        });
    });
};