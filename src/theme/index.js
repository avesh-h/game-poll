'use client';
import { useMemo } from 'react';

import {
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material';

import { components } from './component';
import palette from './palette';
import { typography } from './typography';

const MuiThemeProvider = ({ children }) => {
  //Extra option we can add typography,breakpoint etc..
  const themOptions = useMemo(() => {
    return {
      palette,
      typography,
      components,
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
