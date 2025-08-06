import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl } from '../../app/apiConfig';
import type { User, CreateUser, UsersApiResponse } from '../../interfaces';

const USE_TOKEN = true;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ronditrackApiUrl,
    prepareHeaders: (headers) => {
      if (USE_TOKEN) {
        const token = localStorage.getItem('access_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (response: UsersApiResponse) => response.data,
      providesTags: ['User'],
    }),
    getUsersBySpecificRoles: builder.query<User[], void>({
      query: () => '/users/specific-roles',
      transformResponse: (response: UsersApiResponse) => response.data,
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, CreateUser>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: number; data: Partial<CreateUser> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<User, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetUsersBySpecificRolesQuery,
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} = usersApi;