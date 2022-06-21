const app = require('./app');
const PORT = process.env.PORT || 5002;
module.exports = app.listen(PORT, () => { 
    console.log(`Attendance Microservice has been started on port ${PORT}...`)
}
); // add error handling app