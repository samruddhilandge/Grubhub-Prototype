var express = require("express");
var app = express();
var router = express.Router();
const crypto = require("crypto");
const mysql = require("mysql");
//const mysql = require('mysql');
//var db = require("../config/config");
var mongoose = require("mongoose");

var User = require("../models/User");
var Order = require("../models/Order");
var Bag = require("../models/Bag");
var Message = require("../models/Message");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var requireAuth = passport.authenticate("jwt", { session: false });
var kafka = require("../kafka/client");

app.use(passport.initialize());
require("../config/passport")(passport);

router.post("/buyersignin", function(req, res) {
  console.log("Inside BuyerSign In  Request");

  var oldBuyer = {
    email: req.body.email,
    password: req.body.password
  };

  console.log("email:" + oldBuyer.email);

  console.log("password:" + oldBuyer.password);

  const secret = "abc";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(oldBuyer.password)
    .digest("hex");
  console.log("HASSHH:" + hash);
  console.log(typeof hash);

  User.findOne({
    email: oldBuyer.email
  }).then(
    function(buyerData, err) {
      console.log("First");
      if (buyerData) {
        console.log("Second");
        console.log("userdata is ", buyerData);

        if (buyerData.hashpwd === hash) {
          const buyer_id = buyerData._id;
          console.log("hashed password match");

          var token = jwt.sign({ id: buyer_id }, "xyz", {
            expiresIn: 10080 // in seconds
          });
          //res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
          // res.cookie('buyer_id',buyer_id); //setting the buyer_id
          res.cookie("token", token);

          // req.session.oldBuyer = oldBuyer;
          res.writeHead(200, {
            "Content-Type": "text/plain"
          });

          console.log("buyer_id:", buyer_id);
          res.end(JSON.stringify(buyerData));
        }
      } else {
        console.log("Third");
        console.log("err->", buyerData);
        console.log("error is", err);
      }
    },
    function(err) {
      console.log("Fourth");
      console.log("error is", err);
    }
  );

  //buyerData is the one from the backend
});

router.post("/buyersignup", function(req, res) {
  console.log("Inside Buyer Sign Up Request");

  const secret = "abc";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(req.body.password)
    .digest("hex");
  console.log("HASSHH:" + hash);

  var newBuyer = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    pwd: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    hashpwd: hash
  });

  console.log(newBuyer);

  newBuyer.save().then(
    user => {
      console.log("User created in database: ", user);
    },
    err => {
      console.log("Error Creating User");
    }
  );

  res.writeHead(200, {
    "Content-Type": "text/plain"
  });
  res.end("Successful Registering");
});

//Message to the buyer by the owner
router.post("/messagetobuyer", requireAuth, function(request, response) {
  console.log("Inside send message in the owner Backend");
  console.log(request.body);
  kafka.make_request("messagetobuyer", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Get Messages to the buyer
router.post("/getmessagestobuyer", function(request, response) {
  console.log("To get the messages BUYER SIDE");

  console.log(request.body);
  kafka.make_request("getmessagestobuyer", request.body, function(
    err,
    results
  ) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Message to the Owner by the buyer
router.post("/messagetoowner", requireAuth, function(request, response) {
  console.log("Inside send message in the BUYER");

  console.log(request.body);
  kafka.make_request("messagetoowner", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Get Messages to the Owner
router.post("/getmessagestoowner", requireAuth, function(request, response) {
  console.log("To get the messages OWNER SIDE");

  console.log(request.body);
  kafka.make_request("getmessagestoowner", request.body, function(
    err,
    results
  ) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/search", requireAuth, function(request, response) {
  console.log("In Backend Search");
  console.log(request.body);
  kafka.make_request("search", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/restaurant", requireAuth, function(request, response) {
  console.log("In Backend Restaurant api");
  console.log(request.body);
  kafka.make_request("restaurant", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside restaurant else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/addtobag", requireAuth, function(request, response) {
  console.log("In Backend Add to bag Request");
  console.log(request.body);
  kafka.make_request("addtobag", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside add to bag else");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/bagtable", requireAuth, function(request, response) {
  console.log("In Backend Accessing bagtable data");

  console.log(request.body);
  kafka.make_request("bagtable", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /Bagtable else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/removefrombag", requireAuth, function(request, response) {
  console.log("In Backend Remove from bag Request");

  console.log(request.body);
  kafka.make_request("removefrombag", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /Bagtable else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/orderconfirm", requireAuth, function(request, response) {
  console.log("In Backend Order Confirm Request");

  console.log(request.body);
  kafka.make_request("orderconfirm", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /Bagtable else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/afterorderconfirm", requireAuth, function(request, response) {
  console.log("In Backend After Order Confirm Request");

  console.log(request.body);
  kafka.make_request("afterorderconfirm", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /After Order Confirm else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/buyerorder", requireAuth, function(request, response) {
  console.log("In Backend Buyer Order Request");

  console.log(request.body);
  kafka.make_request("buyerorder", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside Buyer Order else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

router.post("/pastbuyerorder", requireAuth, function(request, response) {
  console.log("In Backend Past Buyer Orders request");

  console.log(request.body);
  kafka.make_request("pastbuyerorder", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside Buyer Order else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});
module.exports = router;
