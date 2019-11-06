var express = require("express");
var router = express.Router();
const crypto = require("crypto");
const mysql = require("mysql");
//var db = require("../config/config");
var mongoose = require("mongoose");
var kafka = require("../kafka/client");
var User = require("../models/User");
var Order = require("../models/Order");
var Section = require("../models/Section");
var Bag = require("../models/Bag");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var requireAuth = passport.authenticate("jwt", { session: false });
router.post("/ownersignup", function(req, res) {
  console.log("Inside OwnerSign Up Request");

  if (!req.body.name) {
  } //validate here
  else {
    const secret = "abc";
    const hash = crypto
      .createHmac("sha256", secret)
      .update(req.body.password)
      .digest("hex");
    console.log("HASSHH:" + hash);

    var newOwner = new User({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      pwd: req.body.password,
      restaurant_name: req.body.restaurantName,
      restaurant_zip: req.body.restaurantZip,
      hashpwd: hash
    });

    console.log(newOwner);

    newOwner.save().then(
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
  }
});

router.post("/ownersignin", function(req, res) {
  console.log("Inside Owner Sign In  Request");

  var oldOwner = {
    email: req.body.email,
    password: req.body.password
  };

  const secret = "abc";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(oldOwner.password)
    .digest("hex");
  console.log("HASSHH:" + hash);
  console.log(typeof hash);

  User.findOne({
    email: oldOwner.email
  }).then(
    function(ownerData, err) {
      console.log("First");
      if (ownerData) {
        console.log("Second");
        console.log("userdata is ", ownerData);

        if (ownerData.hashpwd === hash) {
          const restaurant_id = ownerData._id;
          console.log("hashed password match");

          var token = jwt.sign({ id: restaurant_id }, "xyz", {
            expiresIn: 10080
          });

          res.cookie("token", token);

          res.writeHead(200, {
            "Content-Type": "text/plain"
          });

          res.end(JSON.stringify(ownerData));
        }
      } else {
        console.log("err->", ownerData);
        console.log("error is", err);
      }
    },
    function(err) {
      console.log("error is", err);
    }
  );
});

//Menu of a Restaurant
router.post("/menu", requireAuth, function(request, response) {
  console.log("In Backend menu api");

  console.log(request.body);
  kafka.make_request("menu", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /menu else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Buyers who placed orders

router.post("/buyerids", requireAuth, function(req, res) {
  console.log("In BUYER IDS request");

  var newOrder = {
    restaurant_id: req.body.restaurant_id
  };

  console.log("restaurant_id:" + newOrder.restaurant_id);

  let sql =
    "select DISTINCT buyer_id from PLACED_ORDER where restaurant_id= " +
    mysql.escape(newOrder.restaurant_id);

  db.query(sql, function(err, result) {
    if (err) throw err;
    console.log("records selected", result);

    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
  });
});

//OWNERORDER
router.post("/ownerorder", requireAuth, function(req, res) {
  console.log("In Owner Orders request");

  var newOrder = {
    buyer_id: req.body.buyer_id,
    restaurant_id: req.body.restaurant_id
  };

  console.log("buyer_id:" + newOrder.buyer_id);
  console.log("buyer_id:" + newOrder.restaurant_id);

  let sql =
    "select * from PLACED_ORDER where restaurant_id=" +
    mysql.escape(
      newOrder.restaurant_id + " and buyer_id= " + newOrder.buyer_id
    ) +
    " order by buyer_id";

  db.query(sql, function(err, result) {
    if (err) throw err;
    console.log("records selected", result);

    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
  });
});

router.post("/ordersowner", requireAuth, function(request, response) {
  console.log("In Backend orders owner in OwnerHome");

  console.log(request.body);
  kafka.make_request("ordersowner", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /ordersowner else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Add a section
router.post("/addsection", requireAuth, function(request, response) {
  console.log("In Backend Add section");

  console.log(request.body);
  kafka.make_request("addsection", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /addsection else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Delete a section
router.post("/deleteSection", requireAuth, function(request, response) {
  console.log("In Backend delete section Request");

  console.log(request.body);
  kafka.make_request("deletesection", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /deletesection else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//remove item from section
router.post("/removeitemfromsection", requireAuth, function(request, response) {
  console.log("Remove from section Request");

  console.log(request.body);
  kafka.make_request("removeitemfromsection", request.body, function(
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
      console.log("Inside /removeitemfromsection else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//CANCEL ORDER OWNER SIDE
router.post("/cancelorder", requireAuth, function(request, response) {
  console.log("In Owner Orders request");

  console.log(request.body);
  kafka.make_request("cancelorder", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside /cancelorder else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

//Status:orders
router.post("/statusorder", requireAuth, function(request, response) {
  console.log("In Backend Owner status order request");

  console.log(request.body);
  kafka.make_request("statusorder", request.body, function(err, results) {
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again."
      });
    } else {
      console.log("Inside statusorder else in Backend");
      response.json({
        updatedList: results
      });

      response.end();
    }
  });
});

module.exports = router;
