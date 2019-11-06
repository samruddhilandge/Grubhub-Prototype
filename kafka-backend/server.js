var connection = new require("./kafka/connection");

var search = require("./services/search");
var restaurant = require("./services/restaurant");
var addtobag = require("./services/addtobag");
var bagtable = require("./services/bagtable");
var removefrombag = require("./services/removefrombag");
var orderconfirm = require("./services/orderconfirm");
var afterorderconfirm = require("./services/afterorderconfirm");
var buyerorder = require("./services/buyerorder");
var pastbuyerorder = require("./services/pastbuyerorder");
var menu = require("./services/menu");
var ordersowner = require("./services/ordersowner");
var addsection = require("./services/addsection");
var deletesection = require("./services/deletesection");
var removeitemfromsection = require("./services/removeitemfromsection");
var statusorder = require("./services/statusorder");
var messagetoowner = require("./services/messagetoowner");
var getmessagestobuyer = require("./services/getmessagestobuyer");
var messagetobuyer = require("./services/messagetobuyer");
var getmessagestoowner = require("./services/getmessagestoowner");

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function(message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function(err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res
          }),
          partition: 0
        }
      ];
      producer.send(payloads, function(err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request  service
handleTopicRequest("search", search);
handleTopicRequest("restaurant", restaurant);
handleTopicRequest("addtobag", addtobag);
handleTopicRequest("bagtable", bagtable);
handleTopicRequest("removefrombag", removefrombag);
handleTopicRequest("orderconfirm", orderconfirm);
handleTopicRequest("afterorderconfirm", afterorderconfirm);
handleTopicRequest("buyerorder", buyerorder);
handleTopicRequest("pastbuyerorder", pastbuyerorder);
handleTopicRequest("menu", menu);
handleTopicRequest("ordersowner", ordersowner);
handleTopicRequest("addsection", addsection);
handleTopicRequest("deletesection", deletesection);
handleTopicRequest("removeitemfromsection", removeitemfromsection);
handleTopicRequest("statusorder", statusorder);
handleTopicRequest("messagetoowner", messagetoowner);
handleTopicRequest("getmessagestobuyer", getmessagestobuyer);
handleTopicRequest("messagetobuyer", messagetobuyer);
handleTopicRequest("getmessagestoowner", getmessagestoowner);
