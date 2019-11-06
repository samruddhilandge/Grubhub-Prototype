// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("Inside Menu Request");

  const searchedRestaurantId = msg.restaurant_id;

  console.log("Searched restaurant id:" + msg.restaurant_id);
  console.log(typeof searchedRestaurantId);

  Order.find({
    restaurant_id: msg.restaurant_id,
    placed_order: false
  }).then(
    function(data, err) {
      if (data) {
        console.log("Data for Owner Menu: ", data);
        callback(null, data);
      } else {
        console.log("err->", data);
        console.log("error is", err);
      }
    },
    function(err) {
      console.log("error is", err);
    }
  );
}

exports.handle_request = handle_request;
