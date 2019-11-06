// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("Remove from section Request");

  Order.deleteOne({
    _id: msg.item_id
  }).then(
    item => {
      console.log("Item removed from the database ", item);
    },
    err => {
      console.log("Error Creating item");
    }
  );

  callback(null, "Successful item deletion from section");
}

exports.handle_request = handle_request;
