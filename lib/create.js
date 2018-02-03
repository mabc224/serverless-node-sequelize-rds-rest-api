"use strict";


let db = require('./config/db.js');
let order = require('./models/order')(db.sequelize, db.Sequelize);
let Ajv = require('ajv');
let ajv = Ajv({ allErrors: true });
let userSchema = require('./validation/create-validation.json');

module.exports.create = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
        'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
        'Content-Type': 'application/json'
    };

    const data = JSON.parse(event.body);

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


    order.create(data)
        .then(() => {
            const response = {
                statusCode: 201,
                headers: textResponseHeaders,
                body: "Success",
            };
            callback(null, response);
        }).catch(function(error) {
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
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        }
    })
    return {
        status: 'failed',
        errors: errors
    }
}