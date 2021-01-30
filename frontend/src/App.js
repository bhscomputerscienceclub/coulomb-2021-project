import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';
import React, { Component } from 'react';

class App extends Component {
	  constructor(props) {
    super(props);
    this.state = {
	    tasks: [
		    {heading: "hello", contents: "abc"},
		    {heading: "hello", contents: "abc"},
		    {heading: "hello", contents: "abc"},
		    {heading: "hello", contents: "abc"},
		    {heading: "hello", contents: "abc"}
	    ]
    };
	  }

  render() {
var tasks =	 this.state.tasks.map(function (v) {
return 	(
<Box task={v}/>
	);
});
    return (
    <div>
	    {tasks}
	    </div>
    );
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
