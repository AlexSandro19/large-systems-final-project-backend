require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const proxy = require("express-http-proxy")
// Connect

const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://192.168.0.101:19000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json())

app.use("/auth", proxy("http://localhost:5001"));
app.use("/attendance", proxy("http://localhost:5002"));
app.use("/db", proxy("http://localhost:5003"));
app.use("/report", proxy("http://localhost:5004"));


app.get('/test', (req, res) => {
    res.status(200).send('all good from proxy');
})

module.exports = app;