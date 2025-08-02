// Company interfaces
export interface Company {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Create Company interface (for API requests)
export interface CreateCompany {
  name: string;
  address: string;
  email: string;
  phone: string;
}

// Update Company interface (for API requests)
export interface UpdateCompany {
  name?: string;
  email?: string;
  phone?: string;
}

// API Response interface for companies
export interface CompaniesApiResponse {
  message: string;
  data: Company[];
}
