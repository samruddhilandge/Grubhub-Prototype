var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const mysql = require("mysql");

const crypto = require("crypto");
const Joi = require("@hapi/joi");
var db = require("./config/config");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
var fileLocation = "";
var imageName = "";
let dir = "";
var mongoose = require("mongoose");
var User = require("./models/User");
var Order = require("./models/Order");
var passport = require("passport");
require("./config/passport");

mongoose.connect(
  //put here the connection string to mongodb
);

const multer = require("multer");

app.use(passport.initialize());
app.use(cors({ origin: ";ocalhost:3000", credentials: true }));

app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "localhost:3000"); 
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

var buyer = require("./routes/Buyer");
var owner = require("./routes/Owner");

app.use(buyer);
app.use(owner);

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
