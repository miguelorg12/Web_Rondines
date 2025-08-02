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
  user_id?: number;
}

// API Response interface for branches
export interface BranchesApiResponse {
  message: string;
  data: Branch[];
}

// Branch name types
export type BranchName = 'center' | 'north' | 'south';
