import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Store from './store'

/* Material-UI */
import { Container, CssBaseline } from '@material-ui/core';

/* Pages Component */
import Home from './pages/Home/Home'
import Connect from './pages/Connect/Connect'

/*Componenets*/
import Navbar from './components/Nav/Nav'


const App = () => {
  return (
    <Store>
      <CssBaseline />
      <Router>

        <nav>
          <Navbar />
        </nav>

        <Container maxWidth="lg">
          <Switch>

            <Route path="/Login" component={(props) => <Connect formType='login' {...props} /> } />
            <Route path="/Register" component={(props) => <Connect formType='register' {...props}/>} />

            <Route path="/" component={Home} />

          </Switch>
        </Container>

      </Router>
    </Store>
  );
}

export default App;
