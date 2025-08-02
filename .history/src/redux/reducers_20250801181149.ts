import { usersApi } from "./users/usersApi";
import { companiesApi } from "./companies/companiesApi";
import { branchesApi } from "./branches/branchesApi";
import { reportsApi } from "./reports/reportsApi";

const rootReducer = {
    [usersApi.reducerPath]: usersApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [branchesApi.reducerPath]: branchesApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
};

export default rootReducer;