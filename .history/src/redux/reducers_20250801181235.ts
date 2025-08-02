import { usersApi } from "./users/usersApi";
import { companiesApi } from "./companies/companiesApi";
import { branchesApi } from "./branches/branchesApi";
import { reportsApi } from "./reports/reportsApi";
import { statsApi } from "./stats/statsApi";

const rootReducer = {
    [usersApi.reducerPath]: usersApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [branchesApi.reducerPath]: branchesApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
};

export default rootReducer;