import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import React, { Component } from "react";
import Draggable from "react-draggable";
import Loader from "react-loader-spinner";

var oldPos = [];
async function APIgetAll() {
  let response = await fetch("/notes", {});

  let result = await response.json();
  console.log(result);
  return [
    { id: 1, heading: "hello", contents: "abc", pos: (0, 0) },
    { id: 2, heading: "hello", contents: "abc" },
    { id: 3, heading: "hello", contents: "abc" },
    { id: 4, heading: "hello", contents: "abc" },
    { id: 5, heading: "hello", contents: "abc" },
  ];
}

async function APIsave(note) {
  let response = await fetch("/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });

  let result = await response.json();
  console.log(result);
  return result.id;
}
async function APIloggedIn() {
  let response = await fetch("/user", {
    method: "GET",
  });

  let result = await response.json();
  return result;
}

async function APILogin(user, pass) {
  let response = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass }),
  });

  let result = await response.json();
  return result;
}

function APIdeleteNote(id) {
  fetch("/notes/" + id.toString(), {
    method: "DELETE",
  });
}

function APIpos(newPos) {
  newPos.map(function (e, i) {
    if (oldPos[i].pos !== e.pos) {
      console.log(e.pos);
    }
  });
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
    this.myRefs = {
      uname: React.createRef(),
      password: React.createRef(),
      newNoteHeading: React.createRef(),
      newNoteContent: React.createRef(),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async del(id) {
    this.state.tasks = this.state.tasks.filter((value) => value.id === id);
    APIdeleteNote(id);
  }

  async add(obj) {
    this.state.tasks.push(obj);
    obj.id = await APIsave(obj);
    console.log(this.state.tasks.slice(-1)[0]);
  }

  pos() {
    console.log("a");
  }
  async handleSubmit(event) {
    event.preventDefault();
    if (event.target.firstChild.id === "loginForm") {
      this.setState({ loading: true });
      this.state.username = await APILogin(
        this.myRefs.uname.current.value,
        this.myRefs.password.current.value
      );
      if (this.state.username) this.logIn();
      this.setState({ loading: false });
    } else if (event.target.firstChild.id == "newNoteForm") {
      console.log("newnote");
    } else console.log(event);
  }
  async componentDidMount() {
    this.state.username = await APIloggedIn();

    if (this.state.username) this.logIn();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  async logIn() {
    let a = await APIgetAll();
    this.setState({
      tasks: a,
    });
    this.interval = setInterval(() => this.pos(this.state.tasks), 1000);
  }

  render() {
    if (this.state.loading)
      return <Loader type="Puff" color="#00BFFF" height={100} width={100} />;

    var tasks = this.state.tasks.map(function (v) {
      return <Box task={v} />;
    });
    if (!this.state.username)
      return (
        <div className="container1">
          <form onSubmit={this.handleSubmit}>
            <div className="login" id="loginForm">
              <input
                className="logininput"
                type="text"
                size="32"
                placeholder="Username"
                name="username"
                ref={this.myRefs.uname}
              />{" "}
              <br></br>{" "}
              <input
                className="logininput"
                type="password"
                size="32"
                placeholder="Password"
                ref={this.myRefs.password}
              />
              <br></br>
              <input className="button1" type="submit" value="Submit" />
            </div>
          </form>
        </div>
      );
    return (
      <>
        <div className="container1">
          <div className="login">
            <p>{this.state.username}</p>
          </div>
          <div className="note">
            <form onSubmit={this.handleSubmit} id="newNoteForm">
              <textarea
                cols="16"
                className="head"
                form="newNoteForm"
                placeholder="Heading"
                ref={this.myRefs.newNoteHeading}
              ></textarea>
              <br></br>
              <textarea
                cols="30"
                rows="10"
                form="newNoteForm"
                className="cont"
                placeholder="Note"
                ref={this.myRefs.newNoteContent}
              ></textarea>
              <br></br>
              <input type="submit" value="Add" className="button1" />
            </form>
          </div>
        </div>
        {tasks}
      </>
    );
  }
}

function Box(props) {
  return (
    <Draggable handle=".container">
      <div className="container">
        <div className="note">
          <h3 className="nhead">{props.task.heading}</h3>
          <p className="ncont">{props.task.contents}</p>
          <button className="button1">Delete</button>
        </div>
      </div>
    </Draggable>
  );
}

export default App;
