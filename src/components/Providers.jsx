'use client';

import React from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import MuiLocalizationProvider from './mui/MuiLocalizationProvider';
import NextAuthProvider from './nextAuth/NextAuthProvider';
import NotistackProvider from './NotistackProvider';
import StoreProvider from '@/app/StoreProvider';
import MuiThemeProvider from '@/theme';

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
