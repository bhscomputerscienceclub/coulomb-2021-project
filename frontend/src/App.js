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
    this.state.tasks = await APIgetAll();
    this.interval = setInterval(() => this.pos(this.state.tasks), 1000);
  }

  render() {
    var tasks = this.state.tasks.map(function (v) {
      return <Box task={v} />;
    });
    return <div>{tasks}</div>;
  }
}

function Box(props) {
  return (
    <Draggable>
      <h3>{props.task.heading}</h3>
    </Draggable>
  );
}
export default App;
