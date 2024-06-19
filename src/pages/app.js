import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../components/common/privateRoute";
import HomePage from "../components/home/home";
import InventoryPage from "../components/inventory/inventory";
import SubmitPage from "../components/submitform/submitform";
import AboutPage from "../components/about/about";
// import Account from "../components/pages/profile";
import Login from "../components/login/login";
// import AddRecordPage from "../components/addrec/form_addrec";
import AddRecordPage from "../components/addrec/addRecord";
import UpdateRecordPage from "../components/updaterec/updaterec";
import ManageAccounts from "../components/manageaccounts/manageaccounts";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReportPage from "../components/reportgen/reportgen";

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Router>
      <PrivateRoute path="/app" component={HomePage} />
      <PrivateRoute path="/app/home" component={HomePage} />
      <PrivateRoute path="/app/inventory" component={InventoryPage} />
      <PrivateRoute path="/app/submitform" component={SubmitPage} />
      <PrivateRoute path="/app/about" component={AboutPage} />
      {/* <PrivateRoute path="/app/account" component={Account} /> */}
      <PrivateRoute path="/app/addrec" component={AddRecordPage} />
      <PrivateRoute path="/app/updaterec" component={UpdateRecordPage} />
      <PrivateRoute path="/app/manageaccounts" component={ManageAccounts} />
      <PrivateRoute path="/app/reportgen" component={ReportPage} />
      <Login path="/app/login" />
    </Router>
  </LocalizationProvider>
);

export default App;
