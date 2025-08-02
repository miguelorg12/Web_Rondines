// Branch interfaces
export interface Branch {
  id: number;
  name: string;
  address: string;
  company_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user?: {
    id: number;
    name: string;
    last_name: string;
    curp: string;
    email: string;
    password: string;
    active: boolean;
    biometric: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  } | null;
  company?: {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  } | null;
}

// Create Branch interface (for API requests)
export interface CreateBranch {
  name: string;
  address: string;
  company_id: number;
  user_id: number;
}

// Update Branch interface (for API requests)
export interface UpdateBranch {
  name?: string;
  address?: string;
  company_id?: number;
  user_id?: number;
}

// API Response interface for branches
export interface BranchesApiResponse {
  message: string;
  data: Branch[];
}

// Branch name types
export type BranchName = 'center' | 'north' | 'south';
