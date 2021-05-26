// Dependencies
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Export/Load CRUD functions
module.exports = {
    // POST logic
    post: async function(KIND, body) {
        const params = {
            TableName: KIND,
            Item: body
        };
        return dynamoDb.put(params).promise();
    },

    // GET logic
    get: async function(KIND) {
        return dynamoDb.scan({TableName: KIND}).promise()
            .then(response => response.Items)
    },

    // GET(Specific) logic
    getSpecific: async function(KIND, itemID) {
        const params = {
            TableName: KIND,
            Key: {
                "id": itemID
            }
        };
        return dynamoDb.get(params).promise()
    },

    // PUT logic
    put: async function(KIND, body) {
        const params = {
            Key: {
                id: body.id
            },
            TableName: KIND,
            ConditionExpression: 'attribute_exists(id)',
            UpdateExpression: 'set ' + body.paramName + ' = :v',
            ExpressionAttributeValues: {
                ':v': body.paramValue
            },
            ReturnValue: 'ALL_NEW'
        };
        return dynamoDb.update(params).promise();
    },

    // DELETE logic
    delete: async function(KIND, itemID) {
        const params = {
            Key: {
                id: itemID
            },
            TableName: KIND
        };
        return dynamoDb.delete(params).promise();
    }
};