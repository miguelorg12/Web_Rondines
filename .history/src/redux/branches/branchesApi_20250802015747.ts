import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl } from '../../app/apiConfig';
import type { Branch, CreateBranch, UpdateBranch, BranchesApiResponse } from '../../interfaces';

const USE_TOKEN = true;

export const branchesApi = createApi({
    reducerPath: 'branchesApi',
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
    tagTypes: ['Branch'],
    endpoints: (builder) => ({
        // Get all branches
        getBranches: builder.query<Branch[], void>({
            query: () => ({
                url: '/branches',
                method: 'GET',
            }),
            transformResponse: (response: BranchesApiResponse) => response.data,
            providesTags: ['Branch'],
        }),
        // Get branch by ID
        getBranchById: builder.query<Branch, number>({
            query: (id) => ({
                url: `/branches/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: { data: Branch }) => response.data,
            providesTags: ['Branch'],
        }),
        // Get branches by company ID
        getBranchesByCompany: builder.query<Branch[], number>({
            query: (companyId) => ({
                url: `/companies/${companyId}/branches`,
                method: 'GET',
            }),
            transformResponse: (response: BranchesApiResponse) => response.data,
            providesTags: ['Branch'],
        }),
        // Create new branch
        createBranch: builder.mutation<Branch, CreateBranch>({
            query: (branchData) => ({
                url: '/branches',
                method: 'POST',
                body: branchData,
            }),
            transformResponse: (response: { data: Branch }) => response.data,
            invalidatesTags: ['Branch'],
        }),
        // Update branch
        updateBranch: builder.mutation<Branch, { id: number; data: UpdateBranch }>({
            query: ({ id, data }) => {
                console.log('🔍 Actualizando sucursal:', { id, data });
                return {
                    url: `/branches/${id}`,
                    method: 'PUT',
                    body: data,
                };
            },
            transformResponse: (response: { data: Branch }) => {
                console.log('✅ Respuesta de actualización:', response);
                return response.data;
            },
            transformErrorResponse: (error: unknown) => {
                console.error('❌ Error en actualización:', error);
                return error;
            },
            invalidatesTags: ['Branch'],
        }),
        // Delete branch
        deleteBranch: builder.mutation<void, number>({
            query: (id) => ({
                url: `/branches/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Branch'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useGetBranchesQuery,
    useGetBranchByIdQuery,
    useGetBranchesByCompanyQuery,
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation,
} = branchesApi; 