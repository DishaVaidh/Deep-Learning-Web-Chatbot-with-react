import React, { useState } from "react";
import MaterialIcon from "material-icons-react";
import ChatComponent from "./ChatComponent";
import { baseUrl } from "../config";
import "../styles/style1.css";
import { useEffect } from "react";
import axios from "axios";

function ChatComponent1() {
  const [show, setShow] = useState(true);
  const [api, setApi] = useState(baseUrl + "/get");
  const [firstmsg, setFirstmsg] = useState("");
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    axios
      .get(baseUrl + "/getData")
      .then((res) => {
        setData(res.data.data);
        //console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setMsg(e.target.value);
    const query = e.target.value.toLowerCase();
    setValue(query);
    if (query.length > 1) {
      //console.log(data, "data");
      const filterSuggestions = data.filter(
        (suggestion) => suggestion.toLowerCase().indexOf(query) > -1
      );
      setSuggestions(filterSuggestions);
      setSuggestionsActive(true);
    } else {
      setSuggestionsActive(false);
    }
  };

  const handleClick = (e) => {
    setSuggestions([]);
    setValue(e.target.innerText);
    setSuggestionsActive(false);
    setTimeout(function () {
      document.getElementById("sendBtn").click();
      //console.log("button Clicked");
    }, 10);
  };

  const handleKeyDown = (e) => {
    // UP ARROW
    if (e.keyCode === 38) {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (suggestionIndex - 1 === suggestions.length) {
        return;
      }
      setSuggestionIndex(suggestionIndex + 1);
    }
    // ENTER
    else if (e.keyCode === 13) {
      setValue(suggestions[suggestionIndex]);
      setSuggestionIndex(0);
      setSuggestionsActive(false);
      setTimeout(function () {
        document.getElementById("sendBtn").click();
        //console.log("button Clicked");
      }, 10);
    }
  };

  const Suggestions = () => {
    return (
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => {
          return (
            <div>
              <li
                className={index === suggestionIndex ? "suggestion-active" : ""}
                key={index}
                onClick={handleClick}
              >
                {suggestion}
              </li>
            </div>
          );
        })}
      </ul>
    );
  };
  return (
    <div>
      <div
        style={{ cursor: "pointer", position: "absolute", bottom: 0, right: 0 }}
      >
        <MaterialIcon
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          icon="chat"
          size="75"
          vertical-align="right"
        />
      </div>
      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 224, 255, 1), rgba(0, 133, 255, 1))`,
              }}
            >
              {!show ? (
                <button
                  onClick={() => {
                    setShow(!show);
                    setFirstmsg("");
                    setValue("");
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Home
                </button>
              ) : null}
              <h4 className="modal-title" style={{ width: "100%" }}>
                ChatBot
              </h4>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div
              className="modal-body"
              style={{
                height: show ? "65vh" : "",
                overflowY: show ? "auto" : "",
              }}
            >
              {show ? (
                <div style={{ cursor: "pointer" }}>
                  {!suggestionsActive && (
                    <div id="lists">
                      <h3>Please select your option</h3>
                      <hr></hr>
                      <p
                        onClick={() => {
                          setMsg("");
                          setShow(!show);
                          setApi(baseUrl + "/get");
                          setFirstmsg("Hi! Thanks for coming here");
                        }}
                      >
                        {" "}
                        Option1
                      </p>
                      <hr></hr>
                      <p
                        onClick={() => {
                          setShow(!show);
                          setMsg("");
                          setApi("https://api.agify.io");
                          setFirstmsg("Please send your name to get your age");
                        }}
                      >
                        Option2
                      </p>
                      <hr></hr>
                      <p>Option3</p>
                      <hr></hr>
                      <p>Option4</p>
                      <hr></hr>
                      <p>Option5</p>
                      <hr></hr>
                      <p>Option6</p>
                      <hr></hr>
                    </div>
                  )}
                  {suggestionsActive && (
                    <div>
                      {" "}
                      <b>See suggestions here</b>
                      <Suggestions />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <ChatComponent msg={msg} api={api} firstmsg={firstmsg} />
                </div>
              )}
            </div>

            {show ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    height: "7vh",
                    margin: "2vh",
                  }}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    name="msg"
                    placeholder="Search.."
                    onChange={(e) => handleChange(e)}
                    className="form-control"
                    style={{ width: "80%", float: "left" }}
                    value={value}
                    onKeyDown={handleKeyDown}
                  />

                  <button
                    id="sendBtn"
                    onClick={() => {
                      setApi(baseUrl + "/get");
                      setShow(false);
                      console.log(value);
                      setMsg(value);
                    }}
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent1;
