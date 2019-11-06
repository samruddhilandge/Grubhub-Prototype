import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import axios from "axios";
import ItemTile from "./ItemTile";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { rooturl } from "../config";

class BuyerMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  componentWillMount() {
    const data = {
      buyer_id: localStorage.getItem("buyer_id")
    };

    axios
      .post("http://" + rooturl + ":3001/getmessagestobuyer", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          const messages = response.data.updatedList;

          console.log("messages:", messages);
          this.setState({ messages });
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  render() {
    return (
      <div>
        <NavbarSearch />

        <div>
          <h2 style={{ fontFamily: "berlin sans fb", textAlign: "center" }}>
            Inbox
          </h2>
        </div>

        <div>
          {this.state.messages.map(message => {
            //console.log(order.item_name);
            return (
              <div id="item-tile">
                <h4>Message From : {message.restaurant_name} </h4>
                <h6 style={{ color: "grey" }}>{message.message}</h6>
                <br />
                <br />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BuyerMessages;
