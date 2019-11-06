// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("In Owner Orders request kafka");

  Order.deleteMany({
    restaurant_id: msg.restaurant_id,
    placed_order: true,
    buyer_id: msg.restaurant_id
  }).then(
    order => {
      console.log("Orders deleted", order);
    },
    err => {
      console.log("Error deleting order");
    }
  );

  callback(null, "Successful order deletion");
}

exports.handle_request = handle_request;
