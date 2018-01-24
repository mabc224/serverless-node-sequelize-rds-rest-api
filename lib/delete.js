'use strict';


let db = require('./config/db.js');
let order = require('./models/order')(db.sequelize, db.Sequelize);
let Ajv = require('ajv');
let ajv = Ajv({ allErrors: true });
let userSchema = require('./validation/delete-validation.json');

module.exports.delete = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    const data = Object.assign({}, { 'tenantId': event.pathParameters.id });

    let valid = ajv.validate(userSchema, data);
    if (!valid) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: jsonResponseHeaders,
            body: errorResponse(ajv.errors),
        });
        return;
    }

    const params = {
        sysState: 'closed'
    };

    order.update(params, { where: { tenantId: data.tenantId, sysState: 'open' } })
        .then((order) => {
            const response = {
                statusCode: 200,
                headers: textResponseHeaders,
                body: "Deleted",
            };
            callback(null, response);
        }).catch(function(error) {
            console.error(error);
            callback(null, {
                statusCode: 501,
                headers: textResponseHeaders,
                body: 'Couldn\'t delete the order, Error deleting into DB, Error: ' + error,
            });
        });
};


/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message,
        };
    });
    return JSON.stringify({
        status: 'failed',
        errors: errors
    });
}