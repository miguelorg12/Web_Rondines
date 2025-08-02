// Branch interfaces
export interface Branch {
  id: number;
  branchNumber: string;
  company: string;
  name: string;
  address: string;
  phone?: string;
  manager?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Create Branch interface (for API requests)
export interface CreateBranch {
  branchNumber: string;
  company_id: number;
  name: string;
  address: string;
  phone?: string;
  manager?: string;
}

// API Response interface for branches
export interface BranchesApiResponse {
  message: string;
  data: Branch[];
}

// Branch name types
export type BranchName = 'center' | 'north' | 'south';
