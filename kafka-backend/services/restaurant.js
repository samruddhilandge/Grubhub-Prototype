var Order = require("../models/Order");
var mongoose = require("mongoose");


function handle_request(msg, callback) {
  console.log("Inside Restaurant Request");

  const searchedRestaurantId = msg.id;

  Order.find({
    restaurant_id: searchedRestaurantId,
    placed_order: false
  }).then(
    function(data, err) {
      console.log("First");
      if (data) {
        console.log("Second");
        console.log("Data from Restaurant Order collection is: ", data);

        callback(null, data);
      } else {
        console.log("Third");
        console.log("err->", data);
        console.log("error is", err);
      }
    },
    function(err) {
      console.log("Fourth");
      console.log("error is", err);
    }
  );
}

exports.handle_request = handle_request;
