import { apiInterceptor } from "../apiInterceptor";

export const authApi = apiInterceptor.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignupMutation } = authApi;
