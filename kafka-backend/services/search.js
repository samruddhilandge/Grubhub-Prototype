var Order = require("../models/Order");
var mongoose = require("mongoose");

function handle_request(msg, callback) {
  console.log("Inside BuyerHome Search Request");

  console.log("Searched item:" + msg.searchedItem);

  const searchedItem = msg.searchedItem;
  console.log(typeof searchedItem);
  console.log("Searched item", searchedItem);
  Order.find({
    item_name: searchedItem,
    placed_order: false
  }).then(
    function(data, err) {
      if (data) {
        console.log("Data from Order collection is: ", data);
        callback(null, data);
      } else {
        // console.log("Third");
        console.log("err->", data);
        console.log("error is", err);
      }
    },
    function(err) {
      // console.log("Fourth");
      console.log("error is", err);
    }
  );
}

exports.handle_request = handle_request;
