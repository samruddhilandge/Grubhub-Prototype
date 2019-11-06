import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { OWNER_SIGNIN } from "../redux/constants/action-types";
import { rooturl } from "../config";

class OwnerSignin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      restaurant_id: 0,
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
      this.props.ownersignin(data);
    }
  }

  render() {
    let redirectVar = null;
    if (cookie.load("token")) {
      redirectVar = <Redirect to="/ownerhome" />;
    } else {
      redirectVar = <Redirect to="/ownersignin" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2 style={{ fontWeight: "bolder" }}>Owner Sign in</h2>
                <p>Please enter your username and password</p>
              </div>

              <div class="form-group">
                <input
                  onChange={this.onChange}
                  type="text"
                  class="form-control"
                  name="email"
                  placeholder="name"
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
              <a href="/ownersignup">Create Account</a>
              <div style={{ color: "red" }}>{this.state.invalidError}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//export default OwnerSignin;

const mapStateToProps = state => {
  console.log(state);
  return {
    ownerlogin: state.ownerlogin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ownersignin: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/ownersignin", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("Status Code : ", response.status);
          dispatch({
            type: OWNER_SIGNIN,
            payload: response.data,
            status: response.status
          });

          if (response.status === 200) {
            console.log("succeeds 200 code");
            console.log("response data:", response.data);
            const owner = response.data;
            const restaurant_id = owner._id;
            const owner_name = owner.name;
            console.log("restaurant_id from backend:", restaurant_id);
            localStorage.setItem("restaurant_id", restaurant_id); //clear the session storage
            localStorage.setItem("owner_name", owner_name);
            localStorage.setItem("restaurant_name", owner.restaurant_name);
            console.log(
              "RESTAURANT/OWNER IDD:",
              localStorage.getItem("restaurant_id")
            );
            console.log("OWNER Name:", localStorage.getItem("owner_name"));
          } else {
            alert("Invalid Credentials");
            this.setState({
              authFlag: false
            });
          }
        });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OwnerSignin);
