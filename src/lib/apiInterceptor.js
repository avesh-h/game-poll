import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

//For in case access token expire
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  console.log("called from here");
  console.log("interceptor", { args, api, extraOptions });
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = baseQuery("token/refresh/", api, extraOptions);
    if (refreshResult.data) {
      //set refresh token in the cookie from the backend
      result = await baseQuery(args, api, extraOptions);
    } else {
      //Logout action
    }
  }
  console.log("result", result);
  return result;
};

// Interceptor
export const apiInterceptor = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});