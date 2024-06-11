import React, { useEffect, useState } from "react";
import Layout from "../common/layout";
import { getUser } from "../../services/auth";
import { Box, Typography } from "@mui/material";
import { AccountCircle, Build } from "@mui/icons-material";
import { db } from "../../../firebase-config.js";
import { commonCollections } from "../../services/prefetch.js";
import { collection, onSnapshot } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";

const ReportPage = () => {
  
  return (
    <Layout pageTitle="REPORT GENERATION">
      {/* report gen content container  */}
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          px: 1,
          rowGap: 2,
        }}
      >
        
      </Box>
    </Layout>
  );
};

export default ReportPage;
