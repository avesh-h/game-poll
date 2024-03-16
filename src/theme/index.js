"use client";
import {
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material";
import { useMemo } from "react";
import palette from "./palette";

const MuiThemeProvider = ({ children }) => {
  //Extra option we can add typography,breakpoint etc..
  const themOptions = useMemo(() => {
    return {
      palette,
    };
  }, []);

  const theme = createTheme(themOptions);
  return (
    <StyledEngineProvider injectFirst>
      {/* Your component tree. Now you can override Material UI's styles. */}
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </StyledEngineProvider>
  );
};

export default MuiThemeProvider;
