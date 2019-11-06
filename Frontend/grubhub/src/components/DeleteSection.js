import React, { Component } from "react";
import axios from "axios";

import { rooturl } from "../config";
import cookie from "react-cookies";
import { DELETE_SECTION } from "../redux/constants/action-types";
import { connect } from "react-redux";

class DeleteSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: ""
    };

    this.deleteSection = this.deleteSection.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      section: e.target.value
    });
  }

  deleteSection() {
    const data1 = {
      section: this.state.section,
      restaurant_id: localStorage.getItem("restaurant_id")
    };
    this.props.deletesection(data1);
  }

  render() {
    return (
      <div class="container">
        <div class="modal fade" id="DeleteSection">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Delete Section</h4>
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
                    name="section"
                    placeholder="Section Name"
                  />
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  onClick={this.deleteSection}
                  class="btn btn-danger"
                  data-dismiss="modal"
                  style={{ fontWeight: "bolder" }}
                >
                  Delete Section
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

const mapStateToProps = state => {
  console.log(state);
  return {
    deletesection: state.deletesection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deletesection: data => {
      console.log(data);
      axios
        .post("http://" + rooturl + ":3001/deleteSection", data, {
          headers: { Authorization: `JWT ${cookie.load("token")}` }
        })
        .then(response => {
          console.log("Status Code : ", response.status);
          dispatch({
            type: DELETE_SECTION
          });
          if (response.status === 200) {
            console.log("Response data:", response.data.updatedList);
            console.log(
              "Response data rows:",
              response.data.updatedList.restaurant_name
            );
            alert("Section deleted");
          }
          if (response.status === 202) {
            console.log("in 202 create");
            this.setState({
              flag1: true
            });
          }

          alert("Section added");
          window.location.reload();
        });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteSection);
