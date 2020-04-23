// var Order = require("../models/Order");
var Bag = require("../models/Bag");
var mongoose = require("mongoose");

function handle_request(msg, callback) {
  console.log("Inside Add to bag Request");

  var newItem = new Bag({
    _id: mongoose.Types.ObjectId(),
    buyer_id: msg.buyer_id,
    item_name: msg.item_name,
    item_id: msg.item_id,
    price: msg.price,
    restaurant_id: msg.restaurant_id,
    quantity: msg.quantity,
    restaurant_name: msg.restaurant_name
  });
  console.log("ADD TO BAG BUYER ID::" + newItem.buyer_id);
  console.log("item_name:" + newItem.item_name);

  console.log("price:" + newItem.price);
  console.log("New Item:", newItem);

  newItem.save().then(
    item => {
      console.log("item inserted in database: ", item);
    },
    err => {
      console.log("Error inserting item");
    }
  );

  callback(null, "successful items insertion in the bag");
  // res.writeHead(200, {
  //   "Content-Type": "text/plain"
  // });
  // res.end("Successful Registering");
}

exports.handle_request = handle_request;
