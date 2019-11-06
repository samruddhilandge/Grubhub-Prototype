// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("In status order kafka request");

  Order.updateMany(
    {
      buyer_id: msg.buyer_id,
      restaurant_id: msg.restaurant_id,
      _id: msg.item_id
    },
    { $set: { status: msg.status } },
    function(err, doc) {
      if (err) console.log("Error updating status");
    }
  );

  callback(null, "Successfully status updated");
}

exports.handle_request = handle_request;
