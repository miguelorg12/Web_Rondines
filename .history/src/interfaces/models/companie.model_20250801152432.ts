// Company interfaces
export interface Company {
  id: number;
  companyNumber: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Create Company interface (for API requests)
export interface CreateCompany {
  companyNumber: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

// API Response interface for companies
export interface CompaniesApiResponse {
  message: string;
  data: Company[];
}
