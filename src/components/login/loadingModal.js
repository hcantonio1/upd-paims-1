import React from "react";
import { Box, CircularProgress, Modal } from "@mui/material";

const LoadingModal = ({ open }) => {
  return (
    <Modal open={open}>
      <Box sx={{ width: 1, height: "100%", display: "flex" }}>
        <CircularProgress sx={{ position: "absolute", left: "50%", top: "50%" }} />
      </Box>
    </Modal>
  );
};

export default LoadingModal;
