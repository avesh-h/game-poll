import { apiInterceptor } from "../apiInterceptor";

export const gameActions = apiInterceptor.injectEndpoints({
  endpoints: (builder) => ({
    createGame: builder.mutation({
      query: (body) => ({
        url: "/game",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateGameMutation } = gameActions;
