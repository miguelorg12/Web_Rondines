// Report interfaces
export interface ReportImage {
  id: number;
  image_url: string;
  original_name: string;
  mime_type: string;
  file_size: string;
  spaces_key: string;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ReportUser {
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
}

export interface ReportBranch {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Report {
  id: number;
  description: string;
  status: string;
  severity: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  images: ReportImage[];
  user: ReportUser;
  checkpoint: any | null;
  branch: ReportBranch;
}

// API Response interface for reports
export interface ReportsApiResponse {
  message: string;
  data: Report[];
}
