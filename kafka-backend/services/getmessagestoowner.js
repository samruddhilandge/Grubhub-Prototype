var Message = require("../models/Message");

function handle_request(msg, callback) {
  console.log("To get the messages OWNER SIDE");

  Message.find({
    restaurant_id: msg.restaurant_id,
    isOwnerSender: false
  }).then(function(data, err) {
    if (data) {
      console.log("Data from Message collection is: ", data);

      callback(null, data);
    }
  });
}

exports.handle_request = handle_request;
