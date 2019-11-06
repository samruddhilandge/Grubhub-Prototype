// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("In Past Buyer Orders kafkabackend request");

  Order.find({
    buyer_id: msg.buyer_id,
    $or: [{ status: "cancel" }, { status: "delivered" }]
  }).then(function(data, err) {
    if (data) {
      console.log("Past Buyer order::Data from Order collection is: ", data);

      callback(null, data);
      // req.session.oldBuyer = oldBuyer;
      //   res.writeHead(200, {
      //     "Content-Type": "text/plain"
      //   });

      //   res.end(JSON.stringify(data)); //buyer_id
    } else {
      console.log("err->", data);
      console.log("error is", err);
    }
  });
}

exports.handle_request = handle_request;
