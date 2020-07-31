import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import logo from './logo.svg';
import Home from './pages/Home/index';
import './App.css';

const App = () => {
  return (
    <BrowserRouter >
    <React.Fragment>
      <Switch>
        <Route exact path="/a" component={Home}></Route>
      </Switch>
    </React.Fragment>
  </BrowserRouter>
  )
}

export default App;
