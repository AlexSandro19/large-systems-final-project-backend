const request = require('supertest');
const app = require("../attendance_micro/app.js");

describe('Testing the attendance API and micro', () => {

    //const agent = request.agent(app)
    it('Check if the attendance micro is running', (done) => {
        request(app).get("/test").expect(200,"all good from attendance_micro").end(done)
    });    
 })