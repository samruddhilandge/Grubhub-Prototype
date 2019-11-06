// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("In delete section Request Kafka backend");

  Order.deleteMany({
    restaurant_id: msg.restaurant_id,
    placed_order: false,
    section_name: msg.section
  }).then(
    item => {
      console.log("items of this ection Section removed:", item);
    },
    err => {
      console.log("Error deleting the section");
    }
  );

  callback(null, "Successful section deletion");
}

exports.handle_request = handle_request;
