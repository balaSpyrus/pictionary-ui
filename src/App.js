/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Pictionary from './components/gamePage';
import './css/App.css'; // This uses CSS modules.
import landingPage from './components/landingPage';
import About from './components/about';
import PageNotFound from './components/pageNotFound';


const joinGameRedirect = ({ match }) => {
  return <Redirect to={{
    pathname: "/",
    state: match.params.lobbyLink ? { lobbyLink: match.params.lobbyLink } : undefined
  }} />
}

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path={"/"} component={landingPage} />
          <Route exact path={`/join/:lobbyLink`} render={joinGameRedirect} />
          <Route exact path={`/:server/:lobbyID`} component={Pictionary} />
          <Route exact path="/about" component={About} />
          <Route path='*' component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );

}

export default App;
