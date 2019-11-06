import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { Redirect } from "react-router";

import CartModal from "./CartModal";
import { rooturl } from "../config";

class NavbarSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      profile: false,
      authFlag: false,
      searchedItem: "",
      result: "",
      bag: []
    };
    this.onLogout = this.onLogout.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onCart = this.onCart.bind(this);
    this.onProfile = this.onProfile.bind(this);
  }

  onLogout(e) {
    e.preventDefault();

    cookie.remove("token", { path: "/" });
    localStorage.clear();
    window.location.href = "http://" + rooturl + ":3000/";
  }

  onInputChangeHandler(e) {
    this.setState({
      searchedItem: e.target.value
    });
    console.log(this.state.searchedItem);
  }

  onSearch(e) {
    e.preventDefault();
  }

  onCart(e) {
    e.preventDefault();
    axios
      .post("http://" + rooturl + ":3001/bagtable", null, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(
            "Response data in navbarsearch:",
            response.data.updatedList
          );

          const bag = response.data.updatedList;
          console.log("bag:", bag);
          this.setState({ bag });
          console.log("this.state.bag:", this.state.bag);
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  onProfile(e) {
    e.preventDefault();
    this.setState({
      profile: true
    });
  }

  render() {
    console.log("Searched item:", this.state.searchedItem);
    let redirectSearch = null;
    if (this.state.search) {
      redirectSearch = <Redirect to="/restaurants" />;
    }

    let redirectProfile = null;
    if (this.state.profile) {
      redirectProfile = <Redirect to="/buyerprofile" />;
    }
    let redirectLogout = null;
    if (!cookie.load("token")) {
      console.log("logouttt");
    }
    return (
      <div>
        <CartModal />

        {redirectSearch}
        {redirectProfile}

        <nav class="navbar navbar-inverse navbar-fixed-top">
          <div class="navbar-header">
            <a
              class="navbar-brand"
              href="#"
              style={{ fontFamily: "segoe ui black" }}
            >
              GRUBHUB
            </a>
          </div>

          <div class="nav navbar-right">
            <Link
              to="/buyerprofile"
              class=" m-2"
              style={{ fontWeight: "bolder" }}
            >
              {localStorage.getItem("buyer_name")}
            </Link>
            <Link to="/buyermessages">
              <button
                class="btn btn-primary m-2 btn-sm"
                style={{ fontWeight: "bolder" }}
              >
                My Messages
              </button>
            </Link>
            <Link to="/buyerorder">
              <button
                class="btn btn-primary m-2 btn-sm"
                style={{ fontWeight: "bolder" }}
              >
                My Orders
              </button>
            </Link>
            <button
              class="btn btn-danger m-2 btn-sm"
              onClick={this.openCart}
              style={{ fontWeight: "bolder" }}
              data-toggle="modal"
              data-target="#cartModal"
            >
              My Bag
            </button>
            <button
              onClick={this.onLogout}
              class="btn btn-secondary m-2 btn-sm"
              style={{ fontWeight: "bolder" }}
            >
              Logout
            </button>
          </div>
        </nav>

        <div>
          <div class="container">
            <div class="modal fade" id="cartModal">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h4 class="modal-title">My Bag</h4>
                    <br />
                    <button type="button" class="close" data-dismiss="modal">
                      &times;
                    </button>
                  </div>

                  <div class="modal-body">
                    {this.state.bag.map(b => {
                      console.log(b.item_name);
                      return (
                        <div>
                          <h6>{b.item_name}</h6>
                          <h4>Your total is:: $$</h4>
                        </div>
                      );
                    })}
                  </div>

                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-dismiss="modal"
                      style={{ fontWeight: "bolder" }}
                    >
                      Order Confirm
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                      style={{ fontWeight: "bolder" }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavbarSearch;
