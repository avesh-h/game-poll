"use client";

import React, { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { SnackbarProvider } from "notistack";
import IconButton from "@mui/material/IconButton";
import { Box, SvgIcon } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DoneIcon from "@mui/icons-material/Done";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";

const NotistackProvider = ({ children }) => {
  const notistackRef = useRef(null);

  const onClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  return (
    <SnackbarProvider
      ref={notistackRef}
      iconVariant={{
        info: <SnackbarIcon component={InfoIcon} inheritViewBox />,
        success: <SnackbarIcon component={DoneIcon} inheritViewBox />,
        warning: <SnackbarIcon component={WarningIcon} inheritViewBox />,
        error: <SnackbarIcon component={ErrorIcon} inheritViewBox />,
      }}
      action={(key) => {
        return (
          <IconButton onClick={onClose(key)}>
            <CloseIcon />
          </IconButton>
        );
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotistackProvider;

function SnackbarIcon({ component, color }) {
  return (
    <Box>
      <Box
        component="span"
        sx={{
          mr: 1.5,
          width: 40,
          height: 40,
          display: "flex",
          borderRadius: 1.5,
          alignItems: "center",
          justifyContent: "center",
          //   color: `${color}.main`,
          //   bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
        }}
      >
        <SvgIcon component={component} width={24} height={24} />
      </Box>
    </Box>
  );
}
