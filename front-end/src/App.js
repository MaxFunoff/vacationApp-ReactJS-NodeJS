import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './pages/Home/Home'
import Connect from './pages/Connect/Connect'
import Navbar from './components/Nav/Nav'

function App() {
  return (
    <div className="App">
      <Router>

        <nav>
          <Navbar />
        </nav>

        <main>
          <Switch>

            <Route path="/connect" component={Connect}/>
            
            <Route path="/" exact={true} component={Home} />

          </Switch>
        </main>
        
      </Router>
    </div>
  );
}

export default App;
