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
  biometric: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role: Role;
  branch: Array<{
    id: number;
    name: string;
    address: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
}

// Create User interface (for API requests) - Based on backend CreateUserDto
export interface CreateUser {
  name: string;
  last_name: string;
  curp: string;
  email: string;
  password?: string; // Optional for editing
  confirm_password?: string; // For password confirmation
  role_id?: number; // Required to assign specific role
  active?: boolean; // Optional, defaults to true
  biometric: number; // Always sent as number (0)
}

// API Response interface for users
export interface UsersApiResponse {
  message: string;
  data: User[];
}
