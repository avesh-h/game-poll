import { serverInterceptor } from '../serverInterceptor';

const profileActions = serverInterceptor.injectEndpoints({
  endpoints: (builder) => ({
    getProfileDetails: builder.query({
      query: (id) => {
        return {
          url: `/profile/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['getProfileDetails'],
    }),
    editProfile: builder.mutation({
      query: (body) => ({
        url: `/profile/${body?.id}`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['getProfileDetails'],
    }),
  }),
});

export const { useGetProfileDetailsQuery, useEditProfileMutation } =
  profileActions;
