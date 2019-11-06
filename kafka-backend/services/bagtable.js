// var Order = require("../models/Order");
var Bag = require("../models/Bag");
var mongoose = require("mongoose");

function handle_request(msg, callback) {
  console.log("Accessing bagtable data kafka backend");

  //   const buyer = {
  //     buyer_id: msg.buyer_id
  //   };

  Bag.find({
    buyer_id: msg.buyer_id
  }).then(
    function(data, err) {
      if (data) {
        console.log("Data from Bag collection is: ", data);

        callback(null, data);
        // res.writeHead(200, {
        //   "Content-Type": "text/plain"
        // });

        // res.end(JSON.stringify(data));
      } else {
        console.log("err->", data);
        console.log("error is", err);
      }
    },
    function(err) {
      console.log("error is", err);
    }
  );
  // res.writeHead(200, {
  //   "Content-Type": "text/plain"
  // });
  // res.end("Successful Registering");
}

exports.handle_request = handle_request;
