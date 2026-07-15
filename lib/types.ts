export type UserRole = "customer" | "admin";
export type OrderStatus =
  | "process"
  | "research"
  | "concept"
  | "revision"
  | "finalization"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  min_price: number;
  max_price: number;
  description: string | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface Order {
  id: string;
  order_code: string;
  customer_id: string;
  package_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  brand_name: string | null;
  business_field: string | null;
  target_market: string | null;
  logo_style: string | null;
  message: string;
  deadline: string | null;
  agreed_price: number | null;
  status: OrderStatus;
  progress: number;
  created_at: string;
  updated_at: string;
  packages?: Package | null;
}

export interface ProgressItem {
  id: string;
  order_id: string;
  stage: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  sort_order: number;
}

export interface Revision {
  id: string;
  order_id: string;
  customer_id: string;
  message: string;
  status: "open" | "reviewed" | "resolved";
  admin_response: string | null;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  order_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  is_final: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  order_id: string;
  actor_id: string | null;
  activity_type: string;
  description: string;
  created_at: string;
}
