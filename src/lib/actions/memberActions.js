import { apiInterceptor } from '../apiInterceptor';

const memberActions = apiInterceptor.injectEndpoints({
  endpoints: (builder) => ({
    addMember: builder.mutation({
      query: (body) => ({
        url: '/members',
        method: 'POST',
        body,
      }),
    }),
    removeMember: builder.mutation({
      query: (body) => {
        return {
          url: `/members/${body?.id}`,
          method: 'DELETE',
          body,
        };
      },
      //Now update via socket
      invalidatesTags: (res, err) => {
        if (res) {
          return ['getSingleGame'];
        }
        return [];
      },
    }),
  }),
});

export const { useAddMemberMutation, useRemoveMemberMutation } = memberActions;
