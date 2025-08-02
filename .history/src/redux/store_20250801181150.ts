import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from './users/usersApi';
import { companiesApi } from './companies/companiesApi';
import { branchesApi } from './branches/branchesApi';
import { reportsApi } from './reports/reportsApi';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [branchesApi.reducerPath]: branchesApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      usersApi.middleware,
      companiesApi.middleware,
      branchesApi.middleware,
      reportsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
