import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl, USE_TOKEN } from '../../app/apiConfig';

// Interfaces para las estadísticas
export interface GeneralStats {
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  criticalIncidents: number;
  // Agregar más campos según la respuesta del API
}

export interface BranchStats {
  branchId: number;
  branchName: string;
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  // Agregar más campos según la respuesta del API
}

export interface CompanyStats {
  companyId: number;
  companyName: string;
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  // Agregar más campos según la respuesta del API
}

export interface StatsApiResponse<T> {
  message: string;
  data: T;
}

export const statsApi = createApi({
  reducerPath: 'statsApi',
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
  tagTypes: ['Stats'],
  endpoints: (builder) => ({
    getGeneralStats: builder.query<GeneralStats, void>({
      query: () => '/stats/general',
      transformResponse: (response: StatsApiResponse<GeneralStats>) => response.data,
      providesTags: ['Stats'],
    }),
    getStatsByBranch: builder.query<BranchStats[], void>({
      query: () => '/stats/by-branch',
      transformResponse: (response: StatsApiResponse<BranchStats[]>) => response.data,
      providesTags: ['Stats'],
    }),
    getStatsByCompany: builder.query<CompanyStats[], void>({
      query: () => '/stats/by-company',
      transformResponse: (response: StatsApiResponse<CompanyStats[]>) => response.data,
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetGeneralStatsQuery,
  useGetStatsByBranchQuery,
  useGetStatsByCompanyQuery,
} = statsApi; 