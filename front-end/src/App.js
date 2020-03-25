import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

/* Material-UI */
import { Container } from '@material-ui/core';

/* Pages Component */
import Home from './pages/Home/Home'
import Connect from './pages/Connect.js/Connect'

/*Componenets*/
import Navbar from './components/Nav/Nav'


function App() {
  return (
    <div className="App">
      <Router>

        <nav>
          <Navbar />
        </nav>

        <Container maxWidth="sm">
          <Switch>

            <Route path="/Login" component={() => <Connect formType='login' />} />
            <Route path="/Register" component={() => <Connect formType='register' />} />

            <Route path="/" exact={true} component={Home} />

          </Switch>
        </Container>

      </Router>
    </div>
  );
}

export default App;
