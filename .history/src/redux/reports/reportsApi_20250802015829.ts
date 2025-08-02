import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl } from '../../app/apiConfig';
import type { Report, ReportsApiResponse } from '../../interfaces';

const USE_TOKEN = true;

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
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
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getReports: builder.query<Report[], void>({
      query: () => '/incidents',
      transformResponse: (response: ReportsApiResponse) => response.data,
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
} = reportsApi; 