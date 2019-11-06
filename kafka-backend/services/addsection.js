// var Order = require("../models/Order");
var Section = require("../models/Section");
var mongoose = require("mongoose");
function handle_request(msg, callback) {
  console.log("In Order Confirm Request");

  var newSection = new Section({
    _id: mongoose.Types.ObjectId(),
    section_name: msg.section,
    restaurant_id: msg.restaurant_id
  });

  console.log(newSection);
  newSection.save().then(
    section => {
      console.log("section created in database: ", section);
    },
    err => {
      console.log("Error Creating section");
    }
  );
  callback(null, "Successfully created section");
}

exports.handle_request = handle_request;
