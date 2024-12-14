/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { wakeInventoryCall } from './apps/inventory';
import { Pictionary, PictionaryLandingPage } from './apps/pictionary';
import { About, PageNotFound } from './components';
import './css/App.css'; // This uses CSS modules.
import './firebaseui-styling.global.css'; // Import globally.


const joinGameRedirect = ({ match }) => {
  return <Redirect to={{
    pathname: "/",
    state: match.params.lobbyLink ? { lobbyLink: match.params.lobbyLink } : undefined
  }} />
}

const App = () => {

  useEffect(() => {
    wakeInventoryCall();
  }, [])


  return (
    <div className='App'>
      {/* <AuthProvider> */}
      <Router>
        <Switch>
          <Route exact path={"/"} component={PictionaryLandingPage} />
          <Route exact path={`/join/:lobbyLink`} render={joinGameRedirect} />
          <Route exact path={`/:server/:lobbyID`} component={Pictionary} />
          {/* <PrivateRoute exact path="/apps/inventory" component={InventoryApp} /> */}
          {/* <PrivateRoute exact path="/apps" component={AppList} /> */}
          <Route exact path="/about" component={About} />
          <Route path='*' component={PageNotFound} />
        </Switch>
      </Router>
      {/* </AuthProvider> */}
    </div>
  );

}

export default App;
