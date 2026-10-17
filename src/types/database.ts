// SAKAN (سَكَن) Core Types and Constants

export const EGYPT_GOVERNORATES = [
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo' },
  { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza' },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria' },
  { id: 'qalyubia', nameAr: 'القليوبية', nameEn: 'Qalyubia' },
  { id: 'gharbia', nameAr: 'الغربية', nameEn: 'Gharbia' },
  { id: 'monufia', nameAr: 'المنوفية', nameEn: 'Monufia' },
  { id: 'dakahlia', nameAr: 'الدقهلية', nameEn: 'Dakahlia' },
  { id: 'sharqia', nameAr: 'الشرقية', nameEn: 'Sharqia' },
  { id: 'beheira', nameAr: 'البحيرة', nameEn: 'Beheira' },
  { id: 'kafr_el_sheikh', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh' },
  { id: 'damietta', nameAr: 'دمياط', nameEn: 'Damietta' },
  { id: 'port_said', nameAr: 'بورسعيد', nameEn: 'Port Said' },
  { id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia' },
  { id: 'suez', nameAr: 'السويس', nameEn: 'Suez' },
  { id: 'north_sinai', nameAr: 'شمال سيناء', nameEn: 'North Sinai' },
  { id: 'south_sinai', nameAr: 'جنوب سيناء', nameEn: 'South Sinai' },
  { id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum' },
  { id: 'beni_suef', nameAr: 'بني سويف', nameEn: 'Beni Suef' },
  { id: 'minya', nameAr: 'المنيا', nameEn: 'Minya' },
  { id: 'assiut', nameAr: 'أسيوط', nameEn: 'Assiut' },
  { id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag' },
  { id: 'qena', nameAr: 'قنا', nameEn: 'Qena' },
  { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor' },
  { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan' },
  { id: 'red_sea', nameAr: 'البحر الأحمر', nameEn: 'Red Sea' },
  { id: 'new_valley', nameAr: 'الوادي الجديد', nameEn: 'New Valley' },
  { id: 'matrouh', nameAr: 'مطروح', nameEn: 'Matrouh' },
] as const;

export type GovernorateName = typeof EGYPT_GOVERNORATES[number]['nameAr'];

export type HousingType = 'room' | 'shared_apartment' | 'full_apartment' | 'studio';
export type EligibleOccupants = 'students' | 'workers' | 'both';
export type GenderPreference = 'any' | 'male' | 'female';
export type ListingStatus = 'draft' | 'pending' | 'published' | 'paused' | 'rejected' | 'removed' | 'rented';

export type ComplaintCategory = 
  | 'fake_listing' 
  | 'brokerage_commission' 
  | 'fraud_payment' 
  | 'incorrect_price' 
  | 'harassment' 
  | 'inaccurate_details' 
  | 'other';

export type ComplaintStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'awaiting_info' 
  | 'resolved' 
  | 'rejected' 
  | 'escalated';

export type AdminRole = 
  | 'super_admin' 
  | 'admin' 
  | 'listing_moderator' 
  | 'complaint_reviewer' 
  | 'analyst';

export type NotificationType = 
  | 'match' 
  | 'message' 
  | 'listing_status' 
  | 'complaint_status' 
  | 'security';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  phone_verified?: boolean;
  avatar_url?: string;
  role_preference: 'seeker' | 'provider' | 'both';
  bio?: string;
  is_suspended: boolean;
  suspension_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  user_id: string;
  role: AdminRole;
  assigned_by?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  governorate: string;
  area: string;
  address_private?: string;
  housing_type: HousingType;
  eligible_occupants: EligibleOccupants;
  gender_preference: GenderPreference;
  monthly_rent: number;
  deposit: number;
  utilities_cost: number;
  furnished: boolean;
  available_from: string;
  amenities: string[];
  status: ListingStatus;
  rejection_reason?: string;
  room_occupancy_type?: 'shared' | 'private';
  beds_count?: number;
  rooms_count?: number;
  bathrooms_count?: number;
  max_occupancy?: number;
  show_phone_publicly: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  photos?: ListingPhoto[];
  owner?: Partial<Profile>;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  photo_url: string;
  order_index: number;
  created_at: string;
}

export interface WantedRequest {
  id: string;
  user_id: string;
  housing_type?: HousingType;
  governorate: string;
  area?: string;
  budget_max?: number;
  beds_count?: number;
  occupant_preference?: EligibleOccupants;
  move_in_date?: string;
  furnished_preference?: boolean;
  additional_requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  listing_id?: string;
  seeker_id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
  listing?: Partial<Listing>;
  seeker?: Partial<Profile>;
  provider?: Partial<Profile>;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_system: boolean;
  created_at: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Complaint {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  listing_id?: string;
  conversation_id?: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  resolution_notes?: string;
  reviewer_id?: string;
  created_at: string;
  updated_at: string;
  reporter?: Partial<Profile>;
  listing?: Partial<Listing>;
  evidence?: ComplaintEvidence[];
}

export interface ComplaintEvidence {
  id: string;
  complaint_id: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  related_listing_id?: string;
  related_request_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  actor?: Partial<Profile>;
}
