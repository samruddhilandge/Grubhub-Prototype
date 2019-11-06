// var Order = require("../models/Order");
var Order = require("../models/Order");

function handle_request(msg, callback) {
  console.log("In Buyer Orders request");

  var order = {
    buyer_id: msg.buyer_id
  };

  console.log("buyer_id:" + order.buyer_id);

  Order.find({
    buyer_id: msg.buyer_id,
    $or: [{ status: "ready" }, { status: "new" }, { status: "preparing" }]
  }).then(
    function(data, err) {
      if (data) {
        console.log("Data from Order collection is: ", data);

        callback(null, data);
        // req.session.oldBuyer = oldBuyer;
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
}

exports.handle_request = handle_request;
