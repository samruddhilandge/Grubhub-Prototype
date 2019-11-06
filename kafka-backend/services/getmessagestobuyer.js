var Message = require("../models/Message");

function handle_request(msg, callback) {
  console.log("To get the messages BUYER SIDE");

  Message.find({
    buyer_id: msg.buyer_id,
    isOwnerSender: true
  }).then(
    function(data, err) {
      if (data) {
        console.log("Data from Message collection is: ", data);

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
