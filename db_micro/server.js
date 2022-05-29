require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");

// Connect

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json())

app.use("", require("./routes/course.routes")); // I dont like this, feels wrong
app.use("", require("./routes/student.routes"));
app.use("", require("./routes/teacher.routes"));
app.use("", require("./routes/university.routes"));


app.get('/test', (req, res) => {
    res.status(200).send('all good from micro_db');
})

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Mongo");
        app.listen(PORT, () =>{
            
        });
    } catch (e) {
        console.log(e);
        console.log("Server Error", e.message);
        process.exit(1);
    }
    mongoose.connection.on('error', err => {
        logError(err);
    });
    // mongoose.connection.on('disconnected', err => {
    //   console.log("Disconnected from Mongo");
    //   logError(err);
    // });

}
start();

