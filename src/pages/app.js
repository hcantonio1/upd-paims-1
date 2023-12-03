import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../components/privateRoute";
import Home from "../components/home";
import Account from "../components/profile";
import Login from "../components/login";

const App = () => (
  <Router>
    <PrivateRoute path="/app/home" component={Home} />
    <PrivateRoute path="/app/account" component={Account} />
    <Login path="/app/login" />
  </Router>
);

export default App;
