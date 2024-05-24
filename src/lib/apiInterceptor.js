import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import AppConfig from './utils/app-config';
import { errorHandler } from './utils/errorHandler';

const environment = process.env.NODE_ENV || 'development';

const baseQuery = fetchBaseQuery({
  baseUrl: `${AppConfig[environment]?.apiUrl}/api`,
  // baseUrl:'http://localhost:3000/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    console.log('headers', headers);
    return headers;
  },
});

//For in case access token expire
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    //Refresh token
    const refreshResult = await baseQuery('/token', api, extraOptions);
    if (refreshResult?.data) {
      //set refresh token in the cookie from the backend
      result = await baseQuery(args, api, extraOptions);
    } else {
      //Logout action
    }
  }
  //Global error handling
  errorHandler(result?.error);
  return result;
};

// Interceptor
export const apiInterceptor = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
