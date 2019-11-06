import React, { Component } from "react";
import axios from "axios";
import { rooturl } from "../config";
import cookie from "react-cookies";
import { MESSAGE_TO_OWNER } from "../redux/constants/action-types";
import { connect } from "react-redux";

class MessageToOwner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ""
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  sendMessage() {
    console.log("In sendMessage of MessageToOwner");
    const data = {
      message: this.state.message,
      restaurant_id: localStorage.getItem("restaurant_id_message"),
      buyer_id: localStorage.getItem("buyer_id"),
      buyer_name: localStorage.getItem("buyer_name")
    };
    this.props.messagetoowner(data);
  }

  render() {
    return (
      <div class="container">
        <div class="modal fade" id="MessageToOwner">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Send a Message</h4>
                <br />
                <button type="button" class="close" data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div class="modal-body">
                <div class="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    class="form-control"
                    name="message"
                    placeholder="Message"
                  />
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  onClick={this.sendMessage}
                  class="btn btn-danger"
                  data-dismiss="modal"
                  style={{ fontWeight: "bolder" }}
                >
                  Send Message
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  style={{ fontWeight: "bolder" }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export default MessageToOwner;

const mapStateToProps = state => {
  console.log(state);
  return {
    messagetoowner: state.messagetoowner
  };
};

const mapDispatchToProps = dispatch => {
  return {
    messagetoowner: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/messagetoowner", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("Status Code : ", response.status);
          dispatch({
            type: MESSAGE_TO_OWNER
          });
          if (response.status === 200) {
            console.log("Response data:", response.data.updatedList);
            alert("Message successfully send to the Owner!");
          }
          if (response.status === 202) {
            console.log("in 202 create");
            this.setState({
              flag1: true
            });
          }

          window.location.reload();
        });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageToOwner);
