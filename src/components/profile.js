import React from "react";
import Layout from "./layout";
import { getUser } from "../services/auth";

const Account = () => (
  <Layout pageTitle="Account">
    <h1>Your profile</h1>
    <ul>
      <li>Name: {getUser().name}</li>
      <li>E-mail: {getUser().email}</li>
    </ul>
  </Layout>
);

export default Account;
