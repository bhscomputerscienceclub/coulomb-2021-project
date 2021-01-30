import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';
class App extends React.Component {
  render() {
    return (
      <Draggable>  



        
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
      </Draggable>
    );
  }
}
export default App;
