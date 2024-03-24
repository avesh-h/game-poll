import StoreProvider from '@/app/StoreProvider';
import MuiThemeProvider from '@/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import React from 'react';
import MuiLocalizationProvider from './mui/MuiLocalizationProvider';
import NotistackProvider from './NotistackProvider';
import NextAuthProvider from './nextAuth/NextAuthProvider';

const Providers = ({ children, session }) => {
  return (
    <StoreProvider>
      <AppRouterCacheProvider>
        <MuiThemeProvider>
          <MuiLocalizationProvider>
            <NextAuthProvider session={session}>
              <NotistackProvider>{children}</NotistackProvider>
            </NextAuthProvider>
          </MuiLocalizationProvider>
        </MuiThemeProvider>
      </AppRouterCacheProvider>
    </StoreProvider>
  );
};

export default Providers;
