import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../components/privateRoute";
import HomePage from "../components/pages/home";
import InventoryPage from "../components/pages/inventory";
import SubmitPage from "../components/pages/submitform";
import AboutPage from "../components/pages/about";
// import Account from "../components/pages/profile";
import Login from "../components/pages/login";
import AddRecordPage from "../components/pages/form_addrec";
import UpdateRecordPage from "../components/pages/form_updaterec";
import ArchiveRecordPage from "../components/pages/form_archiverec";

const App = () => (
  <Router>
    <PrivateRoute path="/app/home" component={HomePage} />
    <PrivateRoute path="/app/inventory" component={InventoryPage} />
    <PrivateRoute path="/app/submitform" component={SubmitPage} />
    <PrivateRoute path="/app/about" component={AboutPage} />
    {/* <PrivateRoute path="/app/account" component={Account} /> */}
    <PrivateRoute path="/app/form_addrec" component={AddRecordPage} />
    <PrivateRoute path="/app/form_updaterec" component={UpdateRecordPage} />
    <PrivateRoute path="/app/form_archiverec" component={ArchiveRecordPage} />
    <Login path="/app/login" />
  </Router>
);

export default App;
