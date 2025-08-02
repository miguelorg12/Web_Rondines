import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl } from '../../app/apiConfig';
import type { Company, CreateCompany, UpdateCompany, CompaniesApiResponse } from '../../interfaces';

const USE_TOKEN = true;

export const companiesApi = createApi({
    reducerPath: 'companiesApi',
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
    tagTypes: ['Company'],
    endpoints: (builder) => ({
        // Get all companies
        getCompanies: builder.query<Company[], void>({
            query: () => ({
                url: '/companies',
                method: 'GET',
            }),
            transformResponse: (response: CompaniesApiResponse) => response.data,
            providesTags: ['Company'],
        }),
        // Get company by ID
        getCompanyById: builder.query<Company, number>({
            query: (id) => ({
                url: `/companies/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: { data: Company }) => response.data,
            providesTags: ['Company'],
        }),
        // Create new company
        createCompany: builder.mutation<Company, CreateCompany>({
            query: (companyData) => ({
                url: '/companies',
                method: 'POST',
                body: companyData,
            }),
            transformResponse: (response: { data: Company }) => response.data,
            invalidatesTags: ['Company'],
        }),
        // Update company
        updateCompany: builder.mutation<Company, { id: number; data: UpdateCompany }>({
            query: ({ id, data }) => ({
                url: `/companies/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: { data: Company }) => response.data,
            invalidatesTags: ['Company'],
        }),
        // Delete company
        deleteCompany: builder.mutation<void, number>({
            query: (id) => ({
                url: `/companies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Company'],
        }),
    }),
});

// Export auto-generated hooks
export const {
    useGetCompaniesQuery,
    useGetCompanyByIdQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
} = companiesApi;
