import React, { Component } from "react";
import { Link } from "react-router-dom";
//import cookie from 'react-cookies';
import { rooturl } from "../config";
import { connect } from "react-redux";
import cookie from "react-cookies";

//const BUYER_SIGNUP="BUYER_SIGNUP";
import { BUYER_LOGOUT } from "../redux/constants/action-types";
//import CartModal from './CartModal';

import axios from "axios";

// import {Redirect} from 'react-router';

//create the Navbar Component
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      profile: false,
      menu: false
    };
    this.onLogout = this.onLogout.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onProfile = this.onProfile.bind(this);
    this.onMenu = this.onMenu.bind(this);
  }

  onLogout(e) {
    cookie.remove("token", { path: "/" });
    localStorage.clear();
    window.location.href = "http://" + rooturl + ":3000/";
  }

  onSearch(e) {
    e.preventDefault();
    this.setState({
      search: true
    });
  }

  onProfile(e) {
    e.preventDefault();
    this.setState({
      profile: true
    });
  }

  onMenu(e) {
    e.preventDefault();
    this.setState({
      menu: true
    });
  }

  render() {
    return (
      <div>
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
              to="/ownerprofile"
              class=" m-2 "
              style={{ fontWeight: "bolder" }}
            >
              {localStorage.getItem("owner_name")}
            </Link>
            <Link to="/ownermessages">
              <button
                class="btn btn-danger m-2 btn-sm"
                style={{ fontWeight: "bolder" }}
              >
                My Messages
              </button>
            </Link>
            <Link to="/ownermenu">
              <button
                class="btn btn-danger m-2 btn-sm"
                style={{ fontWeight: "bolder" }}
              >
                My Menu
              </button>
            </Link>
            <button
              onClick={this.onLogout}
              class="btn btn-secondary m-2 btn-sm"
              style={{ fontWeight: "bolder" }}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

//export default Navbar;
const mapStateToProps = state => {
  console.log(state);
  return {
    login: state.login
  };
};
const mapDispatchStateToProps = dispatch => {
  return {
    buyerlogout: () => {
      dispatch({ type: BUYER_LOGOUT });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchStateToProps
)(Navbar);
