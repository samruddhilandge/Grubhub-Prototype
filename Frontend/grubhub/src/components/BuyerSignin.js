import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { rooturl } from "../config";
import { connect } from "react-redux";
import { BUYER_SIGNIN } from "../redux/constants/action-types";

class BuyerSignin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      emailError: "",
      pwdError: "",
      invalidError: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  validate = () => {
    let emailError = "";
    let pwdError = "";

    if (!this.state.email) {
      emailError = "Email is required";
    }
    if (!this.state.password) {
      pwdError = "Password is required";
    }
    if (emailError || pwdError) {
      this.setState({ emailError, pwdError });
      return false;
    }

    return true;
  };

  componentWillMount() {
    this.setState({
      authFlag: false
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    };

    axios.defaults.withCredentials = true;

    const isValid = this.validate();
    if (isValid) {
      this.props.buyersignin(data);
    }
  }

  render() {
    let redirectVar = null;
    if (cookie.load("token")) {
      redirectVar = <Redirect to="/buyerhome" />;
    } else {
      redirectVar = <Redirect to="/buyersignin" />;
    }

    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2 style={{ fontWeight: "bolder" }}>Buyer Sign in</h2>
                <p>Please enter your username and password</p>
              </div>

              <div class="form-group">
                <input
                  onChange={this.onChange}
                  type="text"
                  class="form-control"
                  name="email"
                  placeholder="Email"
                />
                <div style={{ color: "red" }}>{this.state.emailError}</div>
              </div>
              <div class="form-group">
                <input
                  onChange={this.onChange}
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Password"
                />
                <div style={{ color: "red" }}>{this.state.pwdError}</div>
              </div>
              <button onClick={this.onSubmit} class="btn btn-primary">
                Login
              </button>
              <br />
              <br />
              <a href="/buyersignup">Create Account</a>
              <div style={{ color: "red" }}>{this.state.invalidError}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    buyerlogin: state.buyerlogin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    buyersignin: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/buyersignin", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("response from login method", response.data);
          dispatch({
            type: BUYER_SIGNIN,
            payload: response.data,
            status: response.status
          });
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            const buyer = response.data;

            const buyer_id = buyer._id;
            console.log("response buyer", buyer);
            console.log("response buyeraddress", buyer.address);
            localStorage.setItem("buyer_id", buyer_id);
            localStorage.setItem("buyer_name", buyer.name);
            localStorage.setItem("buyer_address", buyer.address);
            console.log("BUYERR ID:", localStorage.getItem("buyer_id"));
            console.log("BUYERR NAME:", localStorage.getItem("buyer_name"));
            console.log(
              "BUYERR ADDRESSS:",
              localStorage.getItem("buyer_address")
            );
            console.log("success 200 code");
          } else {
            console.log("unsuccessful 200 code");
            alert("Invalid credentials");
          }
        });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyerSignin);
