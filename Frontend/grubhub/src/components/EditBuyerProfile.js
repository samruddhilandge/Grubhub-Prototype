import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import RestaurantTile from "./RestaurantTile";
import ItemTile from "./ItemTile";
import { rooturl } from "../config";
import cookie from "react-cookies";
const mapStateToProps = state => {
  console.log(state);
  return {
    registered: state.registered
  };
};

class EditBuyerProfile extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <div>
        <NavbarSearch />
        <div>
          <div>
            <div>
              <input
                onChange={this.onChange}
                value="buyername"
                type="text"
                name="name"
              />
              <br />
            </div>
            <div>
              <input
                onChange={this.onChange}
                value="buyeremail"
                type="text"
                name="email"
              />
              <br />
            </div>
            <div>
              <input
                onChange={this.onChange}
                value="buyerphone"
                type="text"
                name="phone"
              />
              <br />
              <br />
            </div>
            <button onClick={this.onSubmit} class="btn btn-primary">
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

export default EditBuyerProfile;
