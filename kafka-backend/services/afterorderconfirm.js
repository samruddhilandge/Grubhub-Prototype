// var Order = require("../models/Order");
var Bag = require("../models/Bag");

function handle_request(msg, callback) {
  console.log("In After Order Confirm Request kafka backend");

  Bag.deleteMany({
    buyer_id: msg.buyer_id
  }).then(
    item => {
      console.log("Item removed from the Bag with partiuclar buyer_id", item);
    },
    err => {
      console.log("Error Creating item");
    }
  );

  callback(null, "Successful Registering");
}

exports.handle_request = handle_request;
