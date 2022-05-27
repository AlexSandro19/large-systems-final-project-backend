require("dotenv").config();
const express = require('express');

// Connect 

const app = express();
const PORT = process.env.PORT || 5004;

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json())

app.use("", require("./report.routes"));

app.get('/test', (req, res) => {
    res.status(200).send('all good from report_micro');
})

app.listen(PORT, () =>
    console.log(`Report Microservice has been started on port ${PORT}...`)
); // add error handling 