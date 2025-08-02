import type { User } from "../interfaces";

export const usuariosData: User[] = [
  {
    id: 1,
    name: "John",
    last_name: "Doe",
    curp: "JDOE123456HDFLNR01",
    email: "john@gmail.com",
    active: true,
    biometric: null,
    created_at: "2025-07-30T23:59:57.958Z",
    updated_at: "2025-07-30T23:59:57.958Z",
    deleted_at: null,
    role: {
      id: 1,
      name: "SuperAdmin",
      created_at: "2025-07-30T23:59:57.948Z",
      updated_at: "2025-07-30T23:59:57.948Z",
      deleted_at: null
    }
  },
  {
    id: 2,
    name: "Jane",
    last_name: "Smith",
    curp: "JSMI234567MDFLNR02",
    email: "jane@gmail.com",
    active: true,
    biometric: null,
    created_at: "2025-07-30T23:59:58.045Z",
    updated_at: "2025-07-30T23:59:58.045Z",
    deleted_at: null,
    role: {
      id: 2,
      name: "CompanyAdmin",
      created_at: "2025-07-30T23:59:57.952Z",
      updated_at: "2025-07-30T23:59:57.952Z",
      deleted_at: null
    }
  },
  {
    id: 3,
    name: "Carlos",
    last_name: "Ramirez",
    curp: "CRAM345678HDFLNR03",
    email: "carlos@gmail.com",
    active: false,
    biometric: null,
    created_at: "2025-07-30T23:59:58.115Z",
    updated_at: "2025-07-30T23:59:58.115Z",
    deleted_at: null,
    role: {
      id: 3,
      name: "BranchAdmin",
      created_at: "2025-07-30T23:59:57.953Z",
      updated_at: "2025-07-30T23:59:57.953Z",
      deleted_at: null
    }
  }
];
