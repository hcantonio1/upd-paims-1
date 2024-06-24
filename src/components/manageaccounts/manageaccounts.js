import React from "react";
import Layout from "../common/layout.js";
import { Box } from "@mui/material";
import AddDeptAccountForm from "./addDeptAccountForm.js";
import { DepartmentTable } from "./departmentTable.js";
import { AddPropStatusForm } from "./addPropStatusForm.js";

const ManageAccounts = () => {
  return (
    <Layout pageTitle="DEPARTMENT">
      <Box sx={{ display: "flex", flexDirection: "column", padding: 2, margin: 1 }}>
        <TableAndButton table={<DepartmentTable collectionName="user" />} button={<AddDeptAccountForm />} />
        <TableAndButton table={<DepartmentTable collectionName="supplier" />} button={<></>} />
        <TableAndButton table={<DepartmentTable collectionName="item_location" />} button={<></>} />
        <TableAndButton table={<DepartmentTable collectionName="status" />} button={<AddPropStatusForm />} />
      </Box>
    </Layout>
  );
};

export default ManageAccounts;

const TableAndButton = ({ table, button }) => {
  return (
    <>
      {table}
      <br />
      {button}
      <br />
      <br />
    </>
  );
};
