// Dependencies
let request = require('supertest');
var should = require('chai').should();

// Setup call
const path = require('path');
const core = require(path.resolve(__dirname, '../index.js'));
const Task = core.http;

// Init host with URL
const Host = 'http://localhost:8000';

// Init Tests
describe('200 tests', function () {
    this.timeout(300); // timeout with miliseconds
    this.retries(2); // If test failed it will retry X amount of times

    it('[POST] should return 200', function (done) {
        const data = { id: "{id}", name: "{name}", desc: "{desc}", price: 999 };
        request(Host).post("/")
            .send(data)
            .end(function (err, res) {
                if (err) throw err;
                if (res.status !== 200) throw Error('Test doesnt return status 200\n' + err);
                if (res.body.id !== "{id}") throw Error('Test doesnt return ID\n' + err);
            })
        done();
    });

    it('[GET All] should return 200', function (done) {
        request(Host).get("/")
            .end(function (err, res) {
                if (err) throw err;
                if (res.status !== 200) throw Error('Test doesnt return status 200\n' + err);
                if (Object.prototype.hasOwnProperty.call(res.body[0], 'id') !== true) throw Error('Test doesnt return ID\n' + err);
            })
        done();
    });

    it('[GET Specific] should return 200', function (done) {
        request(Host).get("?id={id}")
            .end(function (err, res) {
                if (err) throw err;
                if (res.status !== 200) throw Error('Test doesnt return status 200\n' + err);
                if (Object.prototype.hasOwnProperty.call(res.body[0], 'id') !== true) throw Error('Test doesnt return ID\n' + err);
                if (res.body[0].id !== "{id}") throw Error('Test doesnt return the right ID\n' + err);
            })
        done();
    });

    it('[PUT] should return 200', function (done) {
        const data = { id: "{id}", item: "price", value: "998" };
        request(Host).put('/')
            .send(data)
            .end(function (err, res) {
                if (err) throw err;
                if (res.status !== 200) throw Error('Test doesnt return status 200\n' + err);
                if (res.body.id !== "{id}") throw Error('Test doesnt return ID\n' + err);
                if (res.body.value !== "998") throw Error('Test doesnt return the (new) value\n' + err);
            })
        done();
    });

    it('[DELETE] should return 200', function (done) {
        request(Host).delete("?id={id}")
            .end(function (err, res) {
                if (err) throw err;
                if (res.status !== 200) throw Error('Test doesnt return status 200\n' + err);
                if (res.body.id !== "{id}") throw Error('Test didnt delete entry {id} \n' + err);
                if (res.body.status !== "removed") throw Error('Test didnt return status message \n' + err);
            })
        done();
    });
})