import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import RestaurantTile from "./RestaurantTile";
import ItemTile from "./ItemTile";

//add restaurant tile dynamically according to the fetched data from the database
class Restaurants extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <NavbarSearch />

        <div>
          <ItemTile />
          <RestaurantTile /> {/*HOW TO DECREASE THE SIZE OF THE TILE */}
          <RestaurantTile />
          <RestaurantTile />
          <RestaurantTile />
          <RestaurantTile />
          <RestaurantTile />
        </div>
      </div>
    );
  }
}

export default Restaurants;
