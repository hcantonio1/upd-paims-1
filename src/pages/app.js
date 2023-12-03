import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../components/privateRoute";
import HomePage from "../components/home";
import InventoryPage from "../components/inventory";
import SubmitPage from "../components/submitform";
import AboutPage from "../components/about";
import Account from "../components/profile";
import Login from "../components/login";

const App = () => (
  <Router>
    <PrivateRoute path="/app/home" component={HomePage} />
    <PrivateRoute path="/app/inventory" component={InventoryPage} />
    <PrivateRoute path="/app/submitform" component={SubmitPage} />
    <PrivateRoute path="/app/about" component={AboutPage} />
    <PrivateRoute path="/app/account" component={Account} />
    <Login path="/app/login" />
  </Router>
);

export default App;
