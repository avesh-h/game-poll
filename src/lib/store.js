import { configureStore } from "@reduxjs/toolkit";
import { apiInterceptor } from "./apiInterceptor";

//Now we configure the redux toolkit query in next so in the next js the store will be declare as a individually per request not once.

// make store function will return the new store for each request

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [apiInterceptor.reducerPath]: apiInterceptor.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiInterceptor.middleware),
  });
};

//Now we have a function, makeStore, that we can use to create a store instance per-request
