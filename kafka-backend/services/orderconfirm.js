// var Order = require("../models/Order");
var Order = require("../models/Order");
var mongoose = require("mongoose");

function handle_request(msg, callback) {
  console.log("In Order Confirm Request");

  var newOrder = {
    bag: msg.bag1,
    buyer_id: msg.buyer_id,
    buyer_name: msg.buyer_name,
    buyer_address: msg.buyer_address
  };

  console.log("item_name:" + newOrder.buyer_id);
  //console.log("description:"+newItem.prive);
  console.log("BUyer Name:" + newOrder.buyer_name);
  console.log("Buyer Address:" + newOrder.buyer_address);

  newOrder.bag.map(b => {
    var newOrder1 = new Order({
      _id: mongoose.Types.ObjectId(),
      item_id: b.item_id,
      item_name: b.item_name,
      quantity: b.quantity,
      restaurant_id: b.restaurant_id,
      restaurant_name: b.restaurant_name,
      buyer_id: msg.buyer_id,
      buyer_name: msg.buyer_name,
      buyer_address: msg.buyer_address,
      placed_order: true,
      status: "new"
    });
    console.log("ADD TO BAG BUYER ID::" + newOrder1.buyer_id);
    console.log("item_name:" + newOrder1.item_name);

    console.log("New Item:", newOrder1);

    newOrder1.save().then(
      item => {
        console.log("order inserted in Order: ", item);
      },
      err => {
        console.log("Error inserting item");
      }
    );
  });

  callback(null, "Successful Deletion");
}

exports.handle_request = handle_request;
