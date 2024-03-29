require("dotenv").config();
const express = require('express');

// Connect

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json())

app.use("", require("./routes/attendance.routes"));

app.get('/test', (req, res) => {
    res.status(200).send('all good from attendance_micro');
})

module.exports = app;