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
      query: ({ formData, id }) => {
        return {
          url: `/profile/${id}`,
          body: formData,
          method: 'PUT',
        };
      },
      invalidatesTags: ['getProfileDetails'],
    }),
  }),
});

export const { useGetProfileDetailsQuery, useEditProfileMutation } =
  profileActions;
