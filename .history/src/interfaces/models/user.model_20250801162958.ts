// Role interface
export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// User interface (based on API response)
export interface User {
  id: number;
  name: string;
  last_name: string;
  curp: string;
  email: string;
  active: boolean;
  biometric: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role: Role;
}

// Create User interface (for API requests)
export interface CreateUser {
  name: string;
  last_name: string;
  curp: string;
  email: string;
  password?: string; // Optional for editing
  biometric: string | null; // Puede ser null
  role_id?: number; // Required to assign specific role
  branch_id?: number; // Branch ID
}

// API Response interface for users
export interface UsersApiResponse {
  message: string;
  data: User[];
}
