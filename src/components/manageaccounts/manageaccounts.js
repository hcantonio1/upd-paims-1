import React from "react";
import Layout from "../common/layout.js";
import { Box } from "@mui/material";
import AddDeptAccountForm from "./addDeptAccountForm.js";
import { DepartmentTable } from "./departmentTable.js";

const ManageAccounts = () => {
  return (
    <Layout pageTitle="DEPARTMENT">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          margin: 1,
        }}
      >
        <DepartmentTable collectionName="user" />
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <AddDeptAccountForm />
        </div>
      </Box>
    </Layout>
  );
};

export default ManageAccounts;
