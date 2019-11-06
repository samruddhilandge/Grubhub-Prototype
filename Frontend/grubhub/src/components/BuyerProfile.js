import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import RestaurantTile from "./RestaurantTile";
import ItemTile from "./ItemTile";
import { connect } from "react-redux";
import { Redirect } from "react-router";
//const BUYER_SIGNUP="BUYER_SIGNUP";
import axios from "axios";
import { rooturl } from "../config";
import { SAVE } from "../redux/constants/action-types";
import cookie from "react-cookies";

const mapStateToProps = state => {
  console.log("In map state to props");
  console.log("store state:", state);
  return {
    buyer_name: state.buyer_name,
    buyer_email: state.buyer_email,
    buyer_address: state.buyer_address,
    buyer_phone: state.buyer_phone
  };
};
//add restaurant tile dynamically according to the fetched data from the database
class BuyerProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buyer_name: this.props.buyer_name,
      buyer_email: this.props.buyer_email,
      description: "",
      selectedFile: "",
      imageView: "",
      buyer: [],
      buyer_phone: this.props.buyer_phone,
      buyer_address: this.props.buyer_address,
      buyer_id: localStorage.getItem("buyer_id")
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // this.setState({

    //     buyer_name:this.props.buyer_name,
    //     buyer_email:this.props.buyer_email,
    //     buyer_phone:this.props.buyer_phone,
    //     buyer_address:this.props.buyer_address,
    // })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillMount() {
    const data = {
      buyer_id: localStorage.getItem("buyer_id")
    };

    axios
      .post("http://" + rooturl + ":3001/buyerprofile", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      }) //similar to buyers restaurant page
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          // this.setState({
          //     flag2 : true
          // })
          console.log("Response data:", response.data);
          //console.log("Response data rows:", response.data.restaurant_name);
          const buyer = response.data;
          console.log("Buyer:", buyer);
          this.setState({ buyer });
          this.setState({
            name: this.props.name,
            email: this.props.email,
            phone: this.props.phone,
            address: this.props.address
            // imagelocation:this.props.imagelocation  _____PUT IT HERE LATER
          });
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  onImageChange = e => {
    if (e.target.name == "selectedFile") {
      this.setState({
        selectedFile: e.target.files[0]
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  onSave() {
    const data = {
      buyer_id: localStorage.getItem("buyer_id"),
      name: this.state.name,
      phone: this.state.phone,
      address: this.state.address,
      email: this.state.email
    };

    axios
      .post("http://" + rooturl + ":3001/updatebuyerprofile", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log("Response data:", response.data);

          alert("Profile Successfully updated");
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }
  onSubmit(e) {
    e.preventDefault();
    const { buyer_id, description, selectedFile } = this.state;
    let formData = new FormData();

    formData.append("description", description);
    formData.append("buyer_id", buyer_id);
    formData.append("selectedFile", selectedFile);

    axios
      .post("http://" + rooturl + ":3001/profilePhoto", formData)
      .then(response => {
        console.log("here is the response body", response.body);
        console.log("here is the response data", response.data);
      });
    // this.props.save(data);   //payload...how to pass individual items or do we have to send the whole state
  }

  //  , {
  //     headers: { Authorization: `JWT ${cookie.load("token")}` }
  //   }
  handleGetPhoto = e => {
    axios
      .post("http://" + rooturl + ":3001/download/" + this.state.imagelocation)
      .then(response => {
        console.log("Image Response : ", response.data);
        let imagePreview = "data:image/jpg;base64, " + response.data;
        this.setState({
          imageView: imagePreview
        });
        console.log("imageview");
        console.log(this.state.imageView);
      });
  };

  render() {
    const { description, selectedFile } = this.state;
    return (
      <div>
        <NavbarSearch />

        <div class="profile-main-div">
          <div class="panel">
            <div>
              <form onSubmit={this.onSubmit}>
                {/* {    <input
                type="text"
                name="description"
                value={description}
                onChange={this.onChange}
                multiple
            />} */}

                <img
                  src={this.state.imageView}
                  height="200px"
                  width="200px"
                  style={{ border: "3px solid grey" }}
                />
                {/* <img src={require(this.state.imageView)} height="200px" width="200px" /> */}

                <input
                  type="file"
                  name="selectedFile"
                  onChange={this.onImageChange}
                />
                <button type="submit">Upload my Profile Photo</button>
              </form>
              <div>
                <button onClick={this.handleGetPhoto}>Get Photo</button>
              </div>
            </div>

            <div class="form-group">
              <input
                onChange={this.onChange}
                value={this.state.buyer_name}
                type="text"
                class="form-control"
                name="name"
                placeholder="Name"
              />
              <div style={{ color: "red" }}>{this.state.nameError}</div>
            </div>
            <div class="form-group">
              <input
                onChange={this.onChange}
                value={this.state.buyer_email}
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
                value={this.state.buyer_phone}
                type="text"
                class="form-control"
                name="phone"
                placeholder="Phone"
              />
              <div style={{ color: "red" }}>{this.state.passwordError}</div>
            </div>
            <div class="form-group">
              <input
                onChange={this.onChange}
                value={this.state.buyer_address}
                type="text"
                class="form-control"
                name="address"
                placeholder="Address"
              />
              <div style={{ color: "red" }}>{this.state.passwordError}</div>
            </div>

            <button
              onClick={this.onSave}
              class="btn btn-danger"
              style={{ fontWeight: "bolder" }}
            >
              Save Changes
            </button>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

//export default BuyerProfile;
// const mapDispatchStateToProps = dispatch => {

//     return {
//         save : () => {

//                     dispatch({type: SAVE})

//         }
//     }

// }
// export default connect(mapStateToProps,mapDispatchStateToProps)(BuyerProfile);

export default connect(mapStateToProps)(BuyerProfile);
