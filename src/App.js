/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { wakeInventoryCall } from './apps/inventory';
import { Pictionary, PictionaryLandingPage } from './apps/pictionary';
import { About, PageNotFound } from './components';
import './css/App.css'; // This uses CSS modules.
import './firebaseui-styling.global.css'; // Import globally.

const PICTIONARY_URL = '/apps/pictionary'


const invalidURLRedirect = ({ match }) => {

  if (match.url.includes(PICTIONARY_URL))
    return <Redirect to={PICTIONARY_URL} />;

  return <PageNotFound />;
}

const joinGameRedirect = ({ match }) => {
  return <Redirect to={{
    pathname: PICTIONARY_URL,
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
          <Route exact path="/" component={joinGameRedirect} />
          <Route exact path={PICTIONARY_URL} component={PictionaryLandingPage} />
          <Route exact path={`${PICTIONARY_URL}/join/:lobbyLink`} render={joinGameRedirect} />
          <Route exact path={`${PICTIONARY_URL}/:server/:lobbyID`} component={Pictionary} />
          {/* <PrivateRoute exact path="/apps/inventory" component={InventoryApp} /> */}
          {/* <PrivateRoute exact path="/apps" component={AppList} /> */}
          <Route exact path="/about" component={About} />
          <Route path='*' render={invalidURLRedirect} />
        </Switch>
      </Router>
      {/* </AuthProvider> */}
    </div>
  );

}

export default App;
