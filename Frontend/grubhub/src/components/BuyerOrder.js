import React, { Component } from "react";
import NavbarSearch from "./NavbarSearch";
import axios from "axios";
import { Link } from "react-router-dom";
import { rooturl } from "../config";

import MessageToOwner from "./MessageToOwner";
import cookie from "react-cookies";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button
} from "reactstrap";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 1,
  margin: `0 0 ${grid}px 0`,

  background: isDragging ? "white" : "white",

  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "white" : "white",
  padding: grid,
  width: 320
});

class BuyerOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      restaurant_ids: []
    };

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillMount() {
    const data = {
      buyer_id: localStorage.getItem("buyer_id")
    };

    axios
      .post("http://" + rooturl + ":3001/buyerorder", data, {
        headers: { Authorization: `JWT ${cookie.load("token")}` }
      })
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          const orders = response.data.updatedList;

          console.log("orders:", orders);
          this.setState({ orders });
        }
        if (response.status === 202) {
          console.log("in 202 create");
          this.setState({
            flag1: true
          });
        }
      });
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const restaurant_ids = reorder(
      this.state.restaurant_ids,
      result.source.index,
      result.destination.index
    );

    this.setState({
      restaurant_ids
    });
  }

  onMessage(restaurant_id) {
    localStorage.setItem("restaurant_id_message", restaurant_id);
    console.log("In onMessage of BuyerOrder");
    console.log(
      "restaurant_id_message:",
      localStorage.getItem("restaurant_id_message")
    );
  }

  render() {
    {
      this.state.orders.map(order => {
        if (!this.state.restaurant_ids.includes(order.restaurant_id))
          this.state.restaurant_ids.push(order.restaurant_id);
        console.log("restaurant_ids:", this.state.restaurant_ids);
      });
    }

    return (
      <div>
        <NavbarSearch />
        <MessageToOwner />
        <div>
          <h2 style={{ fontFamily: "berlin sans fb", textAlign: "center" }}>
            My Orders
          </h2>
          <Link to="/pastbuyerorder">
            <button
              type="submit"
              class="btn btn-primary m-2 btn-sm"
              style={{ fontWeight: "bolder", float: "right" }}
            >
              Past Orders
            </button>
            <span></span>
          </Link>
        </div>

        <div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.restaurant_ids.map(restaurant_id => {
                    return (
                      <div>
                        {this.state.orders.map(order => {
                          if (order.restaurant_id === restaurant_id) {
                            return (
                              <div>
                                <Draggable
                                  key={order._id}
                                  draggableId={order._id}
                                  index={order}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )}
                                    >
                                      <Card style={{ height: 280, width: 280 }}>
                                        <CardBody>
                                          <CardTitle>
                                            <h3
                                              style={{
                                                color: "grey",
                                                fontWeight: "bolder"
                                              }}
                                            >
                                              {order.restaurant_name}
                                            </h3>
                                          </CardTitle>
                                          <CardSubtitle>
                                            <h4></h4>
                                          </CardSubtitle>
                                          <CardText>
                                            <h5>
                                              Item Name: {order.item_name}
                                            </h5>
                                            <h5>Quantity: {order.quantity}</h5>
                                            <h5>Status: {order.status}</h5>
                                          </CardText>
                                          <button
                                            onClick={() =>
                                              this.onMessage(
                                                order.restaurant_id
                                              )
                                            }
                                            type="submit"
                                            class="btn btn-danger m-2"
                                            style={{ fontWeight: "bolder" }}
                                            data-toggle="modal"
                                            data-target="#MessageToOwner"
                                          >
                                            Message Restaurant's Owner
                                          </button>
                                        </CardBody>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

export default BuyerOrder;
