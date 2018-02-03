"use strict";


let db = require('./config/db.js');
let order = require('./models/order')(db.sequelize, db.Sequelize);
let Ajv = require('ajv');
let ajv = Ajv({ allErrors: true });
let userSchema = require('./validation/update-validation.json');

module.exports.update = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };


    const data = Object.assign({}, JSON.parse(event.body), { "tenantId": event.pathParameters.id });

    let valid = ajv.validate(userSchema, data);
    if (!valid) {
        console.error("Validation Failed");
        callback(null, {
            statusCode: 400,
            headers: jsonResponseHeaders,
            body: errorResponse(ajv.errors)
        });
        return;
    }

    data.dateEdited = new Date();

    order.update(data, { where: { tenantId: data.tenantId } })
        .then((order) => {
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
                body: "Couldn't update the order, Error updating into DB, Error: " + error
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
            message: error.message
        }
    })
    return JSON.stringify({
        status: 'failed',
        errors: errors
    });
}