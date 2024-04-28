import * as React from "react";
import Layout from "../common/layout";
import { Box } from "@mui/material";
import UpdateProp from "./updateProp";
import UpdateSupplier from "./updateSupplier";

const UpdateRec = () => {
  return (
    <Layout pageTitle="UPDATE">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          margin: 1,
        }}
      >
        <main>
          <UpdateProp />
          <br />
          <br />
          <UpdateSupplier />
        </main>
      </Box>
    </Layout>
  );
};

export const Head = () => <title>Update Database</title>;

export default UpdateRec;
