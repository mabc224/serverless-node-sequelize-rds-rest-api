'use strict';

var db = require('./config/db.js');
var order = require('./models/order')(db.sequelize, db.Sequelize);
var Ajv = require('ajv');
var ajv = Ajv({ allErrors: true });
var userSchema = require('./validation/delete-validation.json');

module.exports.delete = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    var textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    var jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    var data = Object.assign({}, { 'tenantId': event.pathParameters.id });

    var valid = ajv.validate(userSchema, data);
    if (!valid) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: jsonResponseHeaders,
            body: errorResponse(ajv.errors)
        });
        return;
    }

    var params = {
        sysState: 'closed'
    };

    order.update(params, { where: { tenantId: data.tenantId, sysState: 'open' } }).then(function (order) {
        var response = {
            statusCode: 200,
            headers: textResponseHeaders,
            body: "Deleted"
        };
        callback(null, response);
    }).catch(function (error) {
        console.error(error);
        callback(null, {
            statusCode: 501,
            headers: textResponseHeaders,
            body: 'Couldn\'t delete the order, Error deleting into DB, Error: ' + error
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
    return JSON.stringify({
        status: 'failed',
        errors: errors
    });
}