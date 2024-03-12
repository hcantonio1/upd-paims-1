import React from "react";
import Layout from "../layout";
import { Box } from "@material-ui/core";

const ManageAccounts = () => (
  <Layout pageTitle="Manage Accounts">
    <Box>
      <h1>Inventory Supervisor</h1>
      <h3>Supervisors, on top of having Encoder access,</h3>
      <ul>
        <li>should be able to create and delete Trustee accounts</li>
        <li>should be able to create and delete Encoder accounts</li>
      </ul>
    </Box>
    <Box>
      <h1>System Administrator</h1>
      <h3>The admin</h3>
      <ul>
        <li>
          should be able to create and delete Departments and Inventory
          Supervisors
        </li>
        <li>
          only has read access, no write or delete, to the properties of the
          college's departments
        </li>
      </ul>
    </Box>
  </Layout>
);

export default ManageAccounts;
