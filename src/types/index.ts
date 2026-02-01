export interface FormData {
  [key: string]: string | number | boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface TableRecord {
  [key: string]: string | number | boolean;
}

export interface FormError {
  field: string;
  message: string;
} 