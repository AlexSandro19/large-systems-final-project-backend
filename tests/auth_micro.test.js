const request = require('supertest');
const app = require("../auth_micro/app");

describe('Testing the attendance API and micro', () => {

    //const agent = agent(app)
    it('Check if the auth micro is running', (done) => {
        request(app).get("/test").expect(200,'all good from auth_micro').end(done)
    });

 })