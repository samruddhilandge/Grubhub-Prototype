import React ,{Component}from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
//import store from './redux/store/index';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  render(){
  return ( 
    
    
      <BrowserRouter>
      <div> 
      <Main/>
      </div>
      </BrowserRouter> 
  
  );
  }
}

export default App;
