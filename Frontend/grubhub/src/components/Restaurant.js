import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";
import ItemTile from "./ItemTile";
import cookie from "react-cookies";
import { rooturl } from "../config";
import axios from "axios";
import Modal from "./Modal";
import CartModal from "./CartModal";
//import { url } from 'inspector';

//add restaurant Name Menu  dynamically according to the fetched data from the database
class Restaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: localStorage.getItem("restaurant_id"),
      name: localStorage.getItem("restaurant_name"),
      restaurant: [],
      bag: [],
      quantity: 0,
      imageView: []
    };
    this.onQuantityChange = this.onQuantityChange.bind(this);
  }

  componentWillMount() {
    const data = {
      id: this.state.id
    };
    axios
      .post("http://" + rooturl + ":3001/restaurant", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          // this.setState({
          //     flag2 : true
          // })
          console.log("Response data:", response.data.updatedList);
          //console.log("Response data rows:", response.data.restaurant_name);
          const restaurant = response.data.updatedList;
          console.log("restaurant:", restaurant);
          this.setState({ restaurant });

          // this.setState({
          //     restaurant : this.state.restaurant.concat(response.data) ,
          //     length:response.data.length
          // });

          // this.state.restaurant.map(restaurantdata =>
          //     {
          //             // var dataimage =
          //             // {
          //             //     path:property.image,
          //             //     name:property.imagename
          //             // }
          //             console.log(restaurantdata.imagelocation);
          //             axios.post('http://localhost:3001/download/'+restaurantdata.imagelocation)
          //             .then(response => {
          //                 console.log("Imgae Res : ",response);
          //                 let imagePreview = 'data:image/jpg;base64, ' + response.data;
          //                  this.setState({
          //                     imageView: this.state.imageView.concat(imagePreview)
          //                  })

          //             });
          //         });
          /* console.log("this.state.restaurant:",this.state.restaurant);
                console.log("res_id:",this.state.restaurant[0].restaurant_id);
                console.log("res_name:",this.state.restaurant[0].restaurant_name);
                console.log("owner_name:",this.state.restaurant[0].owner_id); */
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  onQuantityChange(e) {
    this.setState({
      quantity: e.target.value
    });
  }

  addToBag(item_name, item_id, price, id) {
    //ADD QUANTITY ALSO //ADD BUYER ID ALSO from local storage

    const data1 = {
      item_name: item_name,
      item_id: item_id,
      price: price,
      restaurant_id: id,
      quantity: this.state.quantity,
      restaurant_name: localStorage.getItem("restaurant_name"),
      buyer_id: localStorage.getItem("buyer_id")
    };
    console.log("DATAAABYEERR ID", data1.buyer_id);
    console.log("DATAAA restarna ID", data1.restaurant_id);
    console.log("DATAAA restura_name", data1.restaurant_name);
    axios
      .post("http://" + rooturl + ":3001/addtobag", data1, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code in addtobag : ", response.status);
        if (response.status === 200) {
          alert("Item added to bag");
          window.location.reload();
          //console.log("Response data:", response.data);
          //console.log("Response data rows:", response.data.restaurant_name);
          //const restaurant=response.data;
          //console.log("restaurant:",restaurant);
          // this.setState(
          //     {restaurant}
          // );

          // this.setState({
          //     restaurant : this.state.restaurant.concat(response.data) ,
          //     length:response.data.length
          // });

          // this.state.restaurant.map(restaurantdata =>
          //     {
          //             // var dataimage =
          //             // {
          //             //     path:property.image,
          //             //     name:property.imagename
          //             // }
          //             console.log(restaurantdata.imagelocation);
          //             axios.post('http://localhost:3001/download/'+restaurantdata.imagelocation)
          //             .then(response => {
          //                 console.log("Imgae Res : ",response);
          //                 let imagePreview = 'data:image/jpg;base64, ' + response.data;
          //                  this.setState({
          //                     imageView: this.state.imageView.concat(imagePreview)
          //                  })

          //             });
          //         });
          /* console.log("this.state.restaurant:",this.state.restaurant);
                console.log("res_id:",this.state.restaurant[0].restaurant_id);
                console.log("res_name:",this.state.restaurant[0].restaurant_name);
                console.log("owner_name:",this.state.restaurant[0].owner_id); */
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  render() {
    return (
      <div>
        <CartModal />
        <NavbarSearch />
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundImage: `url(${"image.jpg"})`
          }}
        >
          {/* {<h1>spaceee</h1>
                            <h1>dddd</h1>
                            <h1>Insert an Image here and set fixed height and width </h1>} */}
        </div>

        <div>
          <h2 style={{ fontFamily: "berlin sans fb", marginLeft: 200 }}>
            {this.state.name}
          </h2>

          <h4 style={{ fontFamily: "berlin sans fb", marginLeft: 200 }}>
            Menu
          </h4>
        </div>
        <div>
          {this.state.restaurant.map(restaurant => {
            //"http://www.tkspizzaonline.com/Images/pizza.jpg"
            return (
              <div>
                <h4>{restaurant.section_name}</h4>
                <div id="item-tile">
                  <div
                    style={{ display: "inline-block", verticalAlign: "top" }}
                  >
                    <img
                      src="http://www.tkspizzaonline.com/Images/pizza.jpg"
                      height="100"
                      width="100"
                    />
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <h4 id="item-detail">
                      {restaurant.item_name}- ${restaurant.price}
                    </h4>
                    <h6 style={{ color: "grey" }}>{restaurant.description}</h6>
                    <div style={{ display: "inline-block", marginRight: "0" }}>
                      {/*Quantity: <div> //0 initialized */}
                      {/*<button class="btn btn-danger m-2 btn-sm"  data-toggle="modal" data-target="#myModal">Add to Bag</button>*/}
                      Quantity:{" "}
                      <input
                        type="text"
                        name="quantity"
                        onChange={this.onQuantityChange}
                      />{" "}
                      {/**restaurant_id is the item id according to mongoose db */}
                      <button
                        class="btn btn-danger m-2 btn-sm"
                        onClick={() =>
                          this.addToBag(
                            restaurant.item_name,
                            restaurant._id,
                            restaurant.price,
                            restaurant.restaurant_id
                          )
                        }
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Restaurant;
