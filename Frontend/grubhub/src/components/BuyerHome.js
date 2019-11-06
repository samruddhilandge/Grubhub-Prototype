import React, { Component } from "react";
import NavbarSearch from "./NavbarSearch";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { rooturl } from "../config";
import axios from "axios";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { BUYER_SEARCH } from "../redux/constants/action-types";

class BuyerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      flag1: false,
      flag2: false,
      cuisineFlag: false,
      searchedItem: "",
      restaurants: [],
      imageView: [],
      cuisine: ""
    };
    this.onSearchChangeHandler = this.onSearchChangeHandler.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onCuisineChange = this.onCuisineChange.bind(this);
    this.onRestaurantSelect = this.onRestaurantSelect.bind(this);
    this.onCuisineSearch = this.onCuisineSearch.bind(this);
  }

  onSearchChangeHandler(e) {
    this.setState({
      searchedItem: e.target.value
    });
    console.log(this.state.searchedItem);
  }
  onCuisineChange(e) {
    this.setState({
      cuisine: e.target.value,
      cuisineFlag: true
    });
  }

  onSearch(e) {
    e.preventDefault();
    const data = {
      searchedItem: this.state.searchedItem
    };

    this.props.buyersearch(data);
    axios
      .post("http://" + rooturl + ":3001/search", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            flag: true
          });
          console.log("Response data:", response.data.updatedList);

          const restaurants = response.data.updatedList;
          this.setState({ restaurants });
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  onRestaurantSelect(id, name) {
    //e.preventDefault();
    const data = {
      id: id,
      name: name
    };

    console.log("id=", data.id);
    localStorage.setItem("restaurant_id", data.id);
    localStorage.setItem("restaurant_name", data.name);
    console.log(
      "Local Storage rest_id:",
      localStorage.getItem("restaurant_id")
    );
    console.log(
      "Local Storage rest_name:",
      localStorage.getItem("restaurant_name")
    );
    this.setState({
      flag2: true
    });
  }

  onCuisineSearch(e) {
    e.preventDefault();
    const data = {
      cuisineSearched: this.state.cuisine
    };

    this.setState({
      restaurants: this.state.restaurants.filter(
        restaurant => restaurant.cuisine === this.state.cuisine
      )
    });
    console.log("restaurants after cuisine filter:", this.state.restaurants);
    console.log("Cuisine:", this.state.cuisine);
  }

  render() {
    var i = -1;
    let redirectVar = null;
    console.log("Searched item:", this.state.searchedItem);
    console.log("result:", this.state.result);
    if (!cookie.load("token")) {
      redirectVar = <Redirect to="/buyersignin" />;
    }

    let restaurant_list;
    //profileAvatar={logo}
    return (
      <div>
        {redirectVar}
        <NavbarSearch />

        <div align="center">
          <input
            type="text"
            name="searcheditem"
            onChange={this.onSearchChangeHandler}
            placeholder="Pizza,Burger,.."
          />
          <button
            onClick={this.onSearch}
            class="btn btn-primary m-2 btn-sm"
            style={{ fontWeight: "bolder" }}
          >
            Find Food
          </button>
          <br></br>
          <input
            type="text"
            name="cuisine"
            onChange={this.onCuisineChange}
            placeholder="Cuisine"
          />
          <button
            onClick={this.onCuisineSearch}
            class="btn btn-danger m-2 btn-sm"
            style={{ fontWeight: "bolder" }}
          >
            Filter by Cuisine
          </button>
          <div>
            <img
              src="https://wallpapershome.com/images/pages/pic_h/16605.jpg"
              height="300"
              width="100%"
            />
          </div>

          <div>
            {this.state.restaurants.map(restaurant => {
              i = i + 1;
              return (
                <div id="restaurant-tile">
                  <div
                    style={{ display: "inline-block", verticalAlign: "top" }}
                  >
                    {/* {<img src={this.state.imageView[i]} height="100" width="100"/>}  */}
                    {
                      <img
                        src="http://static1.squarespace.com/static/54cff157e4b012228216dc91/t/577e8e02e6f2e1347cbf242d/1467911682792/grubhublogo.png"
                        height="100"
                        width="100"
                      />
                    }
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <Link to="/restaurant">
                      <a
                        onClick={() =>
                          this.onRestaurantSelect(
                            restaurant.restaurant_id,
                            restaurant.restaurant_name
                          )
                        }
                      >
                        <h3 style={{ color: "black" }} id="restaurant-detail">
                          {restaurant.restaurant_name}
                        </h3>
                      </a>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

//export default BuyerHome;

const mapStateToProps = state => {
  console.log(state);
  return {
    searchedItem: state.searchedItem
  };
};
const mapDispatchToProps = dispatch => {
  return {
    buyersearch: data => {
      dispatch({
        type: BUYER_SEARCH,
        payload: data
      });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyerHome);
