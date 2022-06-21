const PORT = process.env.PORT || 5000;
const app = require('./app');
module.exports = app.listen(PORT, () =>{
    console.log(`Proxy Microservice has been started on port ${PORT}...`)
}
); // add error handling 
