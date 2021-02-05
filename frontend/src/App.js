import "./App.css";

import React, { Component } from "react";
import Draggable from "react-draggable";

var oldPos = [];
function APIgetAll() {
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
  return true;
  let response = await fetch("/user", {
    method: "GET",
  });

  let result = await response.json();
  console.log(result);
  return result.login;
}

async function APILogin(user, pass) {
  let response = await fetch("/", {
    method: "POST",
    body: JSON.stringify({ user: user, pass: pass }),
  });

  let result = await response.json();
  console.log(result);
  return result.login;
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

  async componentDidMount() {
    this.loggedIn = await APIloggedIn();

    if (this.loggedIn === true) this.logIn();
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
    var tasks = this.state.tasks.map(function (v) {
      return <Box task={v} />;
    });
    return (
      <div>
        <div className="container1">
          <div className="login">
            <input class = "logininput" type='text' size = "32" placeholder='Username' />
            <br></br>
            <input class = "logininput" type='password' size = "32" placeholder='Password' />
            <br></br>
            <button className="button1">Login</button>
          </div>
          <div className="note">
            <textarea
              cols="16"
              className="head"
              placeholder="Heading"
            ></textarea>
            <br></br>
            <textarea
              cols="30"
              rows="10"
              className="cont"
              placeholder="Note"
            ></textarea>
            <br></br>
            <button className="button1">Add</button>
          </div>
        </div>
        {tasks}
      </div>
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
