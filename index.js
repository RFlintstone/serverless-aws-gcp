// Dependencies
const express = require('express');
const path = require('path');
const app = express();

// Init Config
const config = require(path.resolve(__dirname, 'config.js'));
const KIND = config.load.db_table;
// Define REST
let REST;
// Load right db file
if (config.load.db_file === "dyn_db") {
    const serverless = require('serverless-http');
    REST = require(path.resolve(__dirname, 'dyn_db'));
} else if (config.load.db_file === "gcp_db") {
    REST = require(path.resolve(__dirname, 'gcp_db'));
} else {
    throw Error("Solution file doesnt exist \n" + config.db_file + "\n From:\n" + JSON.stringify(config));
}

// Init (global) variables
let result;
let readResult;
let resultStatus;
const successfulRequest = 200;
const badRequest = 400;

// Disable certain Express headers
app.disable('x-powered-by')
app.disable('x-frame-options')

// Call method on POST
app.post('/', async (req, res) => {
    try {
        // Is a DB specified?
        if (typeof KIND === 'undefined' || KIND === null) {
            return
        }
        // const itemID = JSON.parse(req.body).id
        const itemID = req.body.id
        readResult = await REST.getSpecific(KIND, itemID);
        // Check if call returns default or entry ID (default ID being '-' with status 'No Data')
        if (readResult[0].id === "-") {
            // result = await REST.post(KIND, JSON.parse(req.body));
            result = await REST.post(KIND, req.body);
            resultStatus = successfulRequest;
        } else if (readResult[0].id !== "-") {
            result = {message: 'An entry with the specified ID already exists'};
            resultStatus = badRequest;
        }
    } catch (err) {
        result = { "Error": err };
        resultStatus = badRequest;
    }
    // Send result to users screen with appropriate response code
    res.status(resultStatus).send(JSON.stringify(result));
});

// Call method on GET
app.get('/', async (req, res) => {
    try {
        // Is a DB specified?
        if (typeof KIND === 'undefined' || KIND === null) {
            return
        }
        result = await REST.get(KIND);
        resultStatus = successfulRequest;
    } catch (err) {
        result = { "Error": err };
        resultStatus = badRequest;
    }
    // Send result to users screen with appropriate response code
    res.status(resultStatus).send(result);
});

// Call method on GET
app.get('/:id', async (req, res) => {
    try {
        // Is a DB specified?
        if (typeof KIND === 'undefined' || KIND === null) {
            return
        }
        const itemID = req.params.id;
        readResult = await REST.getSpecific(KIND, itemID);
        // Check if objest 'readResult returns any properties.'
        if (Object.keys(readResult).length > 0) {
            result = readResult
            resultStatus = successfulRequest;
        } else {
            result = {message: 'An entry with the specified ID doesnt exists'};
            resultStatus = badRequest;
        }
    } catch (err) {
        result = { "Error": err };
        resultStatus = badRequest;
    }
    // Send result to users screen with appropriate response code
    res.status(resultStatus).send(result);
});

// Call method on PUT
app.put('/', async (req, res) => {
    try {
        // Is a DB specified?
        if (typeof KIND === 'undefined' || KIND === null) {
            return
        }
        const itemID = req.body.id
        readResult = await REST.getSpecific(KIND, itemID);
        // Check if call returns default or entry ID (default ID being '-' with status 'No Data')
        if (readResult[0].id === "-") {
            result = {message: 'An entry with the specified ID doesnt exists'};
            resultStatus = badRequest;
        } else if (readResult[0].id !== "-") {
            result = await REST.put(KIND, req.body);
            resultStatus = successfulRequest;
        }
    } catch (err) {
        result = { "Error": err };
        resultStatus = badRequest;
    }
    // Send result to users screen with appropriate response code
    res.status(resultStatus).send(result);
});

// Call method on DELETE
app.delete('/', async (req, res) => {
    try {
        // Is a DB specified?
        if (typeof KIND === 'undefined' || KIND === null) {
            return
        }
        const itemID = req.query.id;
        if (typeof itemID === 'undefined' || itemID === null) {
            return
        }
        readResult = await REST.getSpecific(KIND, itemID);
        // Check if call returns default or entry ID (default ID being '-' with status 'No Data')
        if (readResult[0].id === "-") {
            result = {message: 'An entry with the specified ID doesnt exists'};
            resultStatus = badRequest;
        } else if (readResult[0].id !== "-") {
            result = await REST.delete(KIND, itemID);
            resultStatus = successfulRequest;
        }
    } catch (err) {
        result = { "Error": err };
        resultStatus = badRequest;
    }
    // Send result to users screen with appropriate response code
    res.status(resultStatus).send(result);
});

// Export app
if (config.load.db_file === "dyn_db") {
    exports.http = serverless(app);
} else if (config.load.db_file === "gcp_db") {
    exports.http = app;
}
