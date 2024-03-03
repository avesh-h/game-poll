"use client";

import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material";

const InputField = styled(TextField)({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "10px",
  },
});

const MuiTextField = ({
  sx,
  value,
  type,
  inputProps,
  register,
  name,
  ...props
}) => {
  return (
    <>
      <InputField
        sx={{ ...sx }}
        value={value}
        type={type}
        inputProps={{ ...register(name), ...inputProps }}
        {...props}
      />
    </>
  );
};

export default MuiTextField;
