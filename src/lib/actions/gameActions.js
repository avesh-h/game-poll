import { apiInterceptor } from '../apiInterceptor';

export const gameActions = apiInterceptor.injectEndpoints({
  endpoints: (builder) => ({
    createGame: builder.mutation({
      query: (body) => ({
        url: '/game',
        method: 'POST',
        body,
      }),
    }),
    getSingleGame: builder.query({
      query: (params) => ({
        url: `/games/${params}`,
        method: 'GET',
        //params,     Only for adding search params
      }),
    }),
    addPlayer: builder.mutation({
      query: (body) => ({
        url: `/games/${body?.gameId}`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateGameMutation,
  useGetSingleGameQuery,
  useAddPlayerMutation,
} = gameActions;
