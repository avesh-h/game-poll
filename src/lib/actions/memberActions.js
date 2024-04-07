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
  }),
});

export const { useAddMemberMutation } = memberActions;
