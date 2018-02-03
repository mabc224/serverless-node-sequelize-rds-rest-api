"use strict";

var db = require('./config/db.js');
var order = require('./models/order')(db.sequelize, db.Sequelize);
var Ajv = require('ajv');
var ajv = Ajv({ allErrors: true });
var userSchema = require('./validation/create-validation.json');

module.exports.create = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    var textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    var jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    var data = JSON.parse(event.body);

    var valid = ajv.validate(userSchema, data);
    if (!valid) {
        console.error("Validation Failed");
        callback(null, {
            statusCode: 400,
            headers: jsonResponseHeaders,
            body: errorResponse(ajv.errors)
        });
        return;
    }

    /*
    const params = {
        tenantId: data.tenantId,
        userId: data.userId,
        portalId: data.portalId,
        customerId: data.customerId,
        type: data.type,
        category: data.category,
        keywords: data.keywords,
        status: data.status,
        sysState: data.sysState || 'open',
        createdBy: data.createdBy
    };*/

    order.create(data).then(function () {
        var response = {
            statusCode: 201,
            headers: textResponseHeaders,
            body: "Success"
        };
        callback(null, response);
    }).catch(function (error) {
        console.error(error);
        callback(null, {
            statusCode: error.statusCode || 501,
            headers: textResponseHeaders,
            body: "Couldn't create the order, Error inserting into DB, Error: " + error
        });
    });
};

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
    var errors = schemaErrors.map(function (error) {
        return {
            path: error.dataPath,
            message: error.message
        };
    });
    return {
        status: 'failed',
        errors: errors
    };
}