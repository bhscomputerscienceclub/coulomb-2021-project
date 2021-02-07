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

  return result.map((v) => JSON.parse(v));
}

async function APIsave(note) {
  let response = await fetch("/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: JSON.stringify(note) }),
  });

  let result = await response.json();
  console.log(result);
}
async function APIloggedIn() {
  let response = await fetch("/user", {
    method: "GET",
  });

  let result = await response.json();
  return result;
}

async function APILogin(user, pass) {
  if (user.length === 0 || pass.length === 0) {
    return false;
  }
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
  newPos.forEach((v, i) => {
    if (oldPos[i] !== v.pos[0] + v.pos[1]) {
      console.log("change" + i);
      fetch("/notes/" + i, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: JSON.stringify(v) }),
      });
    }
    oldPos[i] = v.pos[0] + v.pos[1];
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
    this.draggableMoved = false;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  del(id) {
    var tasks = this.state.tasks;
    tasks.splice(id, 1);
    this.setState({
      tasks: tasks,
    });
    APIdeleteNote(id);
  }

  async add(obj) {
    this.setState({
      tasks: this.state.tasks.concat(obj),
    });
    await APIsave(obj);
  }

  pos() {
    if (this.draggableMoved) {
      this.draggableMoved = false;
      APIpos(this.state.tasks);
    }
  }
  async handleSubmit(event) {
    event.preventDefault();
    if (event.target.firstChild.id === "loginForm") {
      this.setState({ loading: true });
      let uname = await APILogin(
        this.myRefs.uname.current.value,
        this.myRefs.password.current.value
      );
      this.setState({
        username: uname,
      });
      if (this.state.username) this.logIn();
      else alert("login didn't work hms...");
      this.setState({ loading: false });
    } else if (event.target.id === "newNoteForm") {
      await this.add({
        heading: this.myRefs.newNoteHeading.current.value,
        content: this.myRefs.newNoteContent.current.value,
        pos: [0, 0],
      });
      this.myRefs.newNoteHeading.current.value = "";
      this.myRefs.newNoteContent.current.value = "";
    } else console.log(event);
  }
  async componentDidMount() {
    this.setState({ username: await APIloggedIn() });

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
  posState(i, d) {
    var tasks = this.state.tasks.slice();
    tasks[i].pos = [d.x, d.y];
    this.setState({ tasks: tasks });
    this.draggableMoved = true;
  }

  render() {
    if (this.state.loading)
      return <Loader type="Puff" color="#00BFFF" height={100} width={100} />;

    var tasks = [];
    for (var i = 0; i < this.state.tasks.length; i++) {
      let num = i;
      tasks.push(
        <Box
          task={this.state.tasks[i]}
          key={num}
          onDrag={(e, d) => this.posState(num, d)}
          del={() => this.del(num)}
        />
      );
    }

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
            <p className="name">{this.state.username}</p>
          </div>
          <div className="unote">
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
        <div>{tasks}</div>
      </>
    );
  }
}

function Box(props) {
  return (
    <Draggable
      handle=".container"
      onStop={props.onDrag}
      defaultPosition={{ x: props.task.pos[0], y: props.task.pos[1] }}
    >
      <div className="container">
        <div className="note">
          <h3 className="nhead">{props.task.heading}</h3>
          <p className="ncont">{props.task.content}</p>
          <button className="button1" onClick={props.del}>
            Delete
          </button>
        </div>
      </div>
    </Draggable>
  );
}

export default App;
