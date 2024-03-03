import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Interceptor
export const apiInterceptor = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: () => ({}),
});
