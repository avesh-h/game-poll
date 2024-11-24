import { apiInterceptor } from '../apiInterceptor';

//To enhance endpoint to use this in other file.for invalidate tag
apiInterceptor.enhanceEndpoints({
  addTagTypes: ['getSingleGame'],
});

export const gameActions = apiInterceptor.injectEndpoints({
  endpoints: (builder) => ({
    getAllGames: builder.query({
      query: () => ({
        url: '/gamesList',
        method: 'GET',
      }),
      providesTags: ['getAllGames'],
    }),

    createGame: builder.mutation({
      query: (body) => ({
        url: '/games',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['getAllGames'],
    }),

    updateGame: builder.mutation({
      query: (body) => ({
        url: `/games/${body?.gameId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['getSingleGame', 'getAllGames'],
    }),

    getSingleGame: builder.query({
      query: (params) => ({
        url: `/games/${params}`,
        method: 'GET',
        //params,     Only for adding search params key value pair({key:value})
      }),
      providesTags: ['getSingleGame'],
    }),

    addPlayer: builder.mutation({
      query: (body) => ({
        url: `/games/${body?.gameId}`,
        method: 'POST',
        body,
      }),
      // Now update via socket
      invalidatesTags: (res, err) => {
        if (res) {
          return ['getSingleGame'];
        }
        return [];
      },
    }),

    deleteGame: builder.mutation({
      query: (id) => ({
        url: `/games/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getAllGames'],
    }),
  }),
});

export const {
  useCreateGameMutation,
  useGetSingleGameQuery,
  useAddPlayerMutation,
  useGetAllGamesQuery,
  useDeleteGameMutation,
  useUpdateGameMutation,
} = gameActions;
