import React, { Component } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import "../styles/style1.css";
export default class ChatComponent extends Component {
  state = {
    chat:
      this.props.firstmsg !== ""
        ? [{ from: "cb", msag: this.props.firstmsg }]
        : [],
    msg: this.props.msg !== "" ? this.props.msg : "",
  };
  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({ msg: e.target.value });
  };
  handleSend = () => {
    let apiU = this.props.api;
    let ch = this.state.chat;
    if (this.state.msg !== "") ch.push({ from: "you", msag: this.state.msg });
    this.setState({ chat: ch, msg: "" });
    this.forceUpdate();
    if (this.state.msg !== "") {
      if (apiU === baseUrl + "/get") {
        axios
          .get(apiU, { params: { msg: this.state.msg } })
          .then((res) => {
            let ch = this.state.chat;
            //ch.push({ from: "you", msag: this.state.msg });
            ch.push({ from: "cb", msag: res.data });
            this.setState({ chat: ch, msg: "" });
            //this.props.msg = "";
            console.log(this.state);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .get(apiU, { params: { name: this.state.msg } })
          .then((res) => {
            let ch = this.state.chat;
            //ch.push({ from: "you", msag: this.state.msg });
            //console.log(res);
            ch.push({ from: "cb", msag: res.data.age });
            this.setState({ chat: ch, msg: "" });
            console.log(this.state);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.forceUpdate();

      let interval = window.setInterval(function () {
        var elem = document.getElementById("chatt");
        console.log(elem.scrollHeight);
        elem.scrollTop = elem.scrollHeight;
        window.clearInterval(interval);
      }, 100);
    }
  };
  componentDidMount() {
    if (this.props.msg !== "") {
      this.handleSend();
    }
  }
  render() {
    return (
      <div className="container">
        <div>
          <div
            id="chatt"
            style={{
              //overflow: "scroll",
              overflowX: "hidden",
              height: "65vh",
            }}
          >
            {this.state.chat.map((msg) => {
              if (msg.from === "cb") {
                return (
                  <div
                    style={{
                      wordWrap: "break-word",
                      flexWrap: "wrap",
                      fontSize: "15px",
                      fontFamily: "cursive",
                      marginBottom: "10px",
                      borderRadius: "10px",
                      marginRight: "500px",
                      padding: "0.8rem",
                      //paddingBottom: "20px",
                      width: "max-content",
                      backgroundColor: "#dad6d6",

                      float: "left",
                      display: "block",
                    }}
                  >
                    {msg.msag}{" "}
                  </div>
                );
              } else {
                return (
                  <div
                    style={{
                      wordWrap: "normal",
                      flexWrap: "wrap",
                      fontSize: "15px",
                      fontFamily: "cursive",
                      marginBottom: "10px",
                      borderRadius: "10px",
                      marginLeft: "500px",
                      padding: "0.8rem",
                      //paddingBottom: "20px",
                      width: "max-content",
                      backgroundImage: `linear-gradient(to right, rgba(0, 224, 255, 1), rgba(0, 133, 255, 1))`,
                      float: "right",
                      display: "block",
                    }}
                  >
                    {msg.msag}
                  </div>
                );
              }
            })}
          </div>
          <div style={{ display: "flex", height: "7vh" }}>
            <input
              type="text"
              name="msg"
              onChange={(e) => this.handleChange(e)}
              className="form-control"
              style={{ width: "80%", float: "left" }}
              value={this.state.msg}
            />
            <button
              onClick={() => this.handleSend()}
              style={{
                width: "20%",
                marginLeft: "2vh",
                paddingLeft: "1vh",
                paddingRight: "1vh",
              }}
              className="btn btn-primary"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}
