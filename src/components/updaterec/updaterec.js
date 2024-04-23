import * as React from "react";
import Layout from "../common/layout";
import { Box, Button } from "@mui/material";
import UpdateProp from "./updateProp";
import UpdateSupplier from "./updateSupplier";

const UpdateRec = () => {
  return (
    <Layout pageTitle="UPDATE / ARCHIVE">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          margin: 1,
        }}
      >
        <main>
          <Box sx={{ mb: 3 }}>
            <Button
              href="/app/submitform/"
              variant="outlined"
              size="small"
              color="success"
            >
              Back to Forms
            </Button>
          </Box>

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
