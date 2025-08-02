import { usersApi } from "./users/usersApi";
import { companiesApi } from "./companies/companiesApi";
import { branchesApi } from "./branches/branchesApi";

const rootReducer = {
    [usersApi.reducerPath]: usersApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [branchesApi.reducerPath]: branchesApi.reducer,
};

export default rootReducer;