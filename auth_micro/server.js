const app = require('./app');
const PORT = process.env.PORT || 5001;

module.exports=app.listen(PORT, () =>{
    console.log(`Authentification Microservice has been started on port ${PORT}...`)
}
); // add error handling 