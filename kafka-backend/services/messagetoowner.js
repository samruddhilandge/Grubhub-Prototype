var Message = require("../models/Message");
var mongoose = require("mongoose");

function handle_request(msg, callback) {
  console.log("Inside send message in the BUYER");

  var newMessage = new Message({
    _id: mongoose.Types.ObjectId(),
    buyer_id: msg.buyer_id,
    restaurant_id: msg.restaurant_id,
    isOwnerSender: false,
    buyer_name: msg.buyer_name,
    message: msg.message
  });

  console.log("New Message of Buyer to the owner:", newMessage);

  newMessage.save().then(
    message => {
      console.log("message created in database: ", message);
    },
    err => {
      console.log("Error inserting message in the database");
    }
  );

  callback(null, "Successfuly Message send");
}

exports.handle_request = handle_request;
