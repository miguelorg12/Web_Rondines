import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ronditrackApiUrl } from '../../app/apiConfig';

const USE_TOKEN = true;

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

// Función para obtener las fechas del primer y último día del mes actual
const getCurrentMonthDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  return {
    start_date: formatDate(firstDay),
    end_date: formatDate(lastDay)
  };
};

export const statsApi = createApi({
  reducerPath: 'statsApi',
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
  tagTypes: ['Stats'],
  endpoints: (builder) => ({
    getGeneralStats: builder.query<GeneralStats, void>({
      query: () => {
        const { start_date, end_date } = getCurrentMonthDates();
        return `/incidents/stats/general?start_date=${start_date}&end_date=${end_date}`;
      },
      transformResponse: (response: StatsApiResponse<GeneralStats>) => response.data,
      providesTags: ['Stats'],
    }),
    getStatsByBranch: builder.query<BranchStats[], void>({
      query: () => {
        const { start_date, end_date } = getCurrentMonthDates();
        return `/incidents/stats/by-branch?start_date=${start_date}&end_date=${end_date}`;
      },
      transformResponse: (response: StatsApiResponse<BranchStats[]>) => response.data,
      providesTags: ['Stats'],
    }),
    getStatsByCompany: builder.query<CompanyStats[], void>({
      query: () => {
        const { start_date, end_date } = getCurrentMonthDates();
        const url = `/incidents/stats/by-company?start_date=${start_date}&end_date=${end_date}`;
        console.log('🔍 Llamando a getStatsByCompany:', url);
        return url;
      },
      transformResponse: (response: StatsApiResponse<CompanyStats[]>) => {
        console.log('✅ Respuesta de getStatsByCompany:', response);
        return response.data;
      },
      transformErrorResponse: (error: any) => {
        console.error('❌ Error en getStatsByCompany:', error);
        return error;
      },
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetGeneralStatsQuery,
  useGetStatsByBranchQuery,
  useGetStatsByCompanyQuery,
} = statsApi; 