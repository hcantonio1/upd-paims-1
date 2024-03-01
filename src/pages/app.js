import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../components/privateRoute";
import HomePage from "../components/pages/home";
import InventoryPage from "../components/pages/inventory";
import SubmitPage from "../components/pages/submitform";
import AboutPage from "../components/pages/about";
import Account from "../components/pages/profile";
import Login from "../components/pages/login";
import InventoryPlaygroundPage from "../components/inventoryPlayground";

const App = () => (
  <Router>
    <PrivateRoute path="/app/home" component={HomePage} />
    <PrivateRoute path="/app/inventory" component={InventoryPage} />
    <PrivateRoute path="/app/submitform" component={SubmitPage} />
    <PrivateRoute path="/app/about" component={AboutPage} />
    <PrivateRoute path="/app/account" component={Account} />
    <PrivateRoute
      path="/app/inventoryPlayground"
      component={InventoryPlaygroundPage}
    />
    <Login path="/app/login" />
  </Router>
);

export default App;
