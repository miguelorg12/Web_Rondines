import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl } from '../../app/apiConfig';
import type { User, CreateUser, UsersApiResponse } from '../../interfaces';

const USE_TOKEN = false;

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ronditrackApiUrl,
        prepareHeaders: (headers) => {
            if (USE_TOKEN) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // Get all users
        getUsers: builder.query<User[], void>({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
            transformResponse: (response: UsersApiResponse) => response.data,
            providesTags: ['User'],
        }),
        // Get user by ID
        getUserById: builder.query<User, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: { data: User }) => response.data,
            providesTags: ['User'],
        }),
        // Create new user
        createUser: builder.mutation<User, CreateUser>({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData,
            }),
            transformResponse: (response: { data: User }) => response.data,
            invalidatesTags: ['User'],
        }),
        // Update user
        updateUser: builder.mutation<User, { id: number; data: Partial<CreateUser> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: { data: User }) => response.data,
            invalidatesTags: ['User'],
        }),
        // Delete user
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;