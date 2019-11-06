import React, { Component } from "react";
// import {Route} from 'react-router-dom';
import Navbar from "./Navbar";
import axios from "axios";
// import ItemTile from './ItemTile';

import { Redirect } from "react-router";
import MessageToBuyer from "./MessageToBuyer";
import cookie from "react-cookies";
import { CHANGE_STATUS } from "../redux/constants/action-types";
import { connect } from "react-redux";
import { rooturl } from "../config";

class OwnerHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buyer_ids: [],
      orders: [],
      status: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const data = {
      restaurant_id: localStorage.getItem("restaurant_id")
    };

    axios
      .post("http://" + rooturl + ":3001/ordersowner", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          const orders = response.data.updatedList;
          console.log(localStorage.getItem("restaurant_id"));
          console.log("orders:", orders);
          this.setState({ orders });
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSave(buyer_id, item_id) {
    const data = {
      status: this.state.status,
      buyer_id: buyer_id,
      restaurant_id: localStorage.getItem("restaurant_id"),
      item_id: item_id
    };

    this.props.changestatus(data);
  }

  onMessage(buyer_id) {
    localStorage.setItem("buyer_id_message", buyer_id);
    console.log("In onMessage of Owner Home");
    console.log("Buyer_id_message:", localStorage.getItem("buyer_id_message"));
  }

  render() {
    console.log("section selected:", this.state.status);
    let redirectVar = null;

    if (!cookie.load("token")) {
      redirectVar = <Redirect to="/ownersignin" />;
    }

    {
      this.state.orders.map(order => {
        if (!this.state.buyer_ids.includes(order.buyer_id))
          this.state.buyer_ids.push(order.buyer_id);
        console.log("buyer_ids:", this.state.buyer_ids);
      });
    }

    //profileAvatar={logo}
    return (
      <div>
        {redirectVar}
        <Navbar />
        <MessageToBuyer />

        <div>
          <h2 style={{ fontFamily: "berlin sans fb", textAlign: "center" }}>
            My Restaurant
          </h2>
          <h4 style={{ fontFamily: "berlin sans fb", textAlign: "center" }}>
            My Orders
          </h4>
        </div>

        <div>
          {this.state.orders.map(order => {
            return (
              <div>
                <h4 style={{ color: "black", fontFamily: "berlin sans fb" }}>
                  Customer Name:{" "}
                  <span style={{ color: "grey" }}> {order.buyer_name}</span>
                </h4>
                <h4 style={{ color: "black", fontFamily: "berlin sans fb" }}>
                  Customer Address:{" "}
                  <span style={{ color: "grey" }}> {order.buyer_address}</span>{" "}
                </h4>
                <h4 style={{ fontFamily: "berlin sans fb" }}>
                  ---->{order.item_name} ---- Qty.({order.quantity}){" "}
                </h4>

                <div>
                  <h4 style={{ fontFamily: "berlin sans fb" }}>Status:</h4>
                  <select
                    onChange={this.onChange}
                    class="form-control"
                    name="status"
                  >
                    <option value="new">New</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancel">Cancel</option>
                  </select>
                  <button
                    onClick={() => this.onSave(order.buyer_id, order._id)}
                    class="btn btn-danger m-2"
                    style={{ fontWeight: "bolder" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => this.onMessage(order.buyer_id)}
                    type="submit"
                    class="btn btn-primary m-2"
                    style={{ fontWeight: "bolder" }}
                    data-toggle="modal"
                    data-target="#MessageToBuyer"
                  >
                    Message This Buyer
                  </button>
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

//export default OwnerHome;

const mapStateToProps = state => {
  console.log(state);
  return {
    statuschanged: state.statuschanged
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changestatus: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/statusorder", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("Status Code : ", response.status);
          dispatch({
            type: CHANGE_STATUS
          });
          if (response.status === 200) {
            alert("Status successfully changed");
          }
          if (response.status === 202) {
            console.log("in 202 create");
            this.setState({
              flag1: true
            });
          }
        });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OwnerHome);
