const request = require('supertest');
const app = require("../proxy/server");
//const auth = require("../auth_micro/server");
const assert = require('assert');
//const attendance = require("../attendance_micro/server");    
  
describe('Testing the attendance API and micro', () => {
  
    beforeAll(async ()=>{
        // const agent_attendance = request.agent(attendance);
        // const auth_attendance = request.agent(auth);
    })
    it('Check if the proxy micro is running', (done) => {
        request(app).get("/test").expect(200,'all good from proxy').end(done)
    });
    it("Check login api",(done)=>{
        const user = {
            email:"alex155r@stud.kea.dk",
            password: "alex123",
        }
       const response= request(app).post("/auth/login").send(user)
    //    console.debug(response);
       response.expect(200).then((response )=>{
        assert(response.body.email,user.email)
        done();
       })
    })
    afterAll(()=>{
        // attendance.close();
        // auth.close();
         app.close();
    })
 })
