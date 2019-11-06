import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { OWNER_SIGNUP } from "../redux/constants/action-types";
import { rooturl } from "../config";

class OwnerSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      restaurantName: "",
      restaurantZip: "",
      nameError: "",
      emailError: "",
      passwordError: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  onSubmit = e => {
    var headers = new Headers();

    e.preventDefault();
    const data = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
      restaurantName: this.state.restaurantName,
      restaurantZip: this.state.restaurantZip
    };
    var isValid = this.validate();
    if (isValid) {
      this.props.ownersignup(data);
    }
  };

  render() {
    let redirectVar = null;
    if (this.props.ownerregistered) {
      redirectVar = <Redirect to="/ownersignin" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2 style={{ fontWeight: "bolder" }}>Owner Sign up</h2>
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
                </div>

                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    class="form-control"
                    name="restaurantName"
                    placeholder="Restaurant Name"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    class="form-control"
                    name="restaurantZip"
                    placeholder="Restaurant Zip Code"
                    required
                  />
                </div>
                <button class="btn btn-primary">Create Account</button>
                <br />
                <br />

                <div style={{ color: "red" }}>{this.state.Error}</div>
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
    ownerregistered: state.ownerregistered
  };
};
//export default BuyerSignup;
const mapDispatchStateToProps = dispatch => {
  return {
    ownersignup: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/ownersignup", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("response from login method", response.data);
          dispatch({ type: OWNER_SIGNUP });
        });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchStateToProps
)(OwnerSignup);
