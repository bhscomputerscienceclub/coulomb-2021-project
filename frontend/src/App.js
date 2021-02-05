import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';
import React, { Component } from 'react';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks: [
				{ heading: "hellooooo", contents: "abc"},
			]
		};
	}

	render() {
		var tasks = this.state.tasks.map(function (v) {
			return (
				<Box task={v}  />
			);
		});
		return (
			<div>
				<div className="container1">
				<div className="note">
					<textarea cols="16"className = "head" placeholder = "Heading"></textarea><br></br>
					<textarea cols="30" rows="10" className = "cont" placeholder = "Note"></textarea><br></br>
					<button className = "button1">Add</button>
				</div>
			</div>
				{tasks}
			</div>
		);
	}
}

function Box(props) {
	return (
		
		<Draggable handle= ".container">
			<div className="container">
				<div className="note">
					<h3 className = "nhead">{props.task.heading}</h3>
					<p className = "ncont">{props.task.contents}</p>
					<button className = "button1">Delete</button>
				</div>
			</div>
		</Draggable>
	);
}

export default App;
