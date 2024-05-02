import React from "react";
import { Box, CircularProgress, Modal } from "@mui/material";

const LoadingModal = ({ open }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </Modal>
  );
};

export default LoadingModal;
