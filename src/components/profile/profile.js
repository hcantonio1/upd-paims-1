import React from "react";
import Layout from "../common/layout";
import { getUser } from "../../services/auth";

const Account = () => (
  <Layout pageTitle="Account">
    <h1>Your profile</h1>
    <ul>
      <li>E-mail: {getUser().email}</li>
    </ul>
  </Layout>
);

export default Account;
