// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("In Orders owners request kafka backend");

  Order.find({
    restaurant_id: msg.restaurant_id,
    placed_order: true
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
