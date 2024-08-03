import { configureStore } from '@reduxjs/toolkit';

import { apiInterceptor } from './apiInterceptor';
import { authSlice, authActions } from './redux/authSlice';
import { serverInterceptor } from './serverInterceptor';
import { getAuthSession } from './utils/editPlayerDetails';

// Custom middleware will always called whenever any action will be dispatched we can access the current state and payload before completed that action called

// const createMiddleware = (store) => (next) => (action) => {
//   // const result = next(action);
//   console.log('store', { store, next, action });
//   const result = next(action);
//   if (action.type === '@@INIT' && typeof window !== 'undefined') {
//     console.log('dispatch called');
//     store.dispatch(authActions.rehydrateAuthState());
//   }
//   return result;
// };

//Now we configure the redux toolkit query in next so in the next js the store will be declare as a individually per request not once.

// make store function will return the new store for each request

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [apiInterceptor.reducerPath]: apiInterceptor.reducer,
      //Delegate server
      [serverInterceptor.reducerPath]: serverInterceptor.reducer,
      auth: authSlice.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        apiInterceptor.middleware,
        serverInterceptor.middleware,
      ]),
  });
  // Rehydrate auth state on startup (whenever refresh it will check user is authorized or not)
  if (typeof window !== 'undefined') {
    getAuthSession().then((data) => {
      if (data) {
        store.dispatch(authActions.rehydrateAuthState(data?.auth));
      }
    });
  }
  return store;
};

//Now we have a function, makeStore, that we can use to create a store instance per-request
