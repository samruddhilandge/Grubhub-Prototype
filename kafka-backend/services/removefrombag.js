// var Order = require("../models/Order");
var Bag = require("../models/Bag");

function handle_request(msg, callback) {
  console.log("Remove from bag Request");

  Bag.deleteOne({
    item_id: msg.item_id,
    buyer_id: msg.buyer_id
  }).then(
    item => {
      console.log("Item removed from the database ", item);
    },
    err => {
      console.log("Error Creating item");
    }
  );
  callback(null, "Successful removing");
  //   res.writeHead(200, {
  //     "Content-Type": "text/plain"
  //   });
  //   res.end("Successful removing");
}

exports.handle_request = handle_request;
