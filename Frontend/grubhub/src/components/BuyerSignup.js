import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { BUYER_SIGNUP } from "../redux/constants/action-types";
import { rooturl } from "../config";

class BuyerSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      nameError: "",
      emailError: "",
      passwordError: "",
      address: "",
      phone: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
  }

  validate = () => {
    let nameError = "";
    let emailError = "";
    let passwordError = "";

    if (!this.state.name) {
      nameError = "Name is required";
    }

    if (!this.state.email) {
      emailError = "Email is required";
    }
    if (!this.state.password) {
      passwordError = "Password is required";
    }

    if (nameError || emailError || passwordError) {
      this.setState({ nameError, emailError, passwordError });
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

  onPhoneChange = e => {
    console.log("In phone change handler ");
    this.setState({
      phone: e.target.value
    });
  };

  onSubmit(e) {
    e.preventDefault();
    console.log("this.state.phone1", this.state.phone);
    e.target.value == ""
      ? (document.getElementById("phone-error").innerHTML =
          "Please enter your phone")
      : (document.getElementById("phone-error").innerHTML = "");
    console.log("this.state.phone2", this.state.phone);

    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!regex.test(String(this.state.phone).toLowerCase())) {
      document.getElementById("phone-error").innerHTML =
        "Please enter valid phone address";
    } else {
      const data = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        phone: this.state.phone,
        address: this.state.address
      };
      var isValid = this.validate();
      if (isValid) {
        this.props.buyersignup(data);
      }
    }
  }

  render() {
    let redirectVar = null;
    if (this.props.registered) {
      redirectVar = <Redirect to="/buyersignin" />;
    }

    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2 style={{ fontWeight: "bolder" }}>Buyer Sign up</h2>
                <p>Create your Grubhub Account</p>
              </div>
              <form onSubmit={this.onSubmit}>
                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    class="form-control"
                    name="name"
                    placeholder="Name"
                    required
                  />
                  <div style={{ color: "red" }}>{this.state.nameError}</div>
                </div>
                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="email"
                    class="form-control"
                    name="email"
                    placeholder="Email"
                    required
                  />

                  <div id="email-error" class="error"></div>
                </div>
                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="password"
                    class="form-control"
                    name="password"
                    placeholder="Password"
                    required
                  />
                  <div style={{ color: "red" }}>{this.state.passwordError}</div>
                </div>
                <div class="form-group">
                  <input
                    onChange={this.onPhoneChange}
                    type="text"
                    class="form-control"
                    name="phone"
                    placeholder="Phone No."
                    required
                  />
                  <div id="phone-error" class="error"></div>
                </div>
                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    class="form-control"
                    name="address"
                    placeholder="Address"
                    required
                  />
                </div>
                <button class="btn btn-primary">Create Account</button>
                <br />
                <br />
              </form>
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
    registered: state.registered
  };
};
//export default BuyerSignup;

const mapDispatchStateToProps = dispatch => {
  return {
    buyersignup: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/buyersignup", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("response from login method", response.data);
          dispatch({ type: BUYER_SIGNUP });
        });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchStateToProps
)(BuyerSignup);
