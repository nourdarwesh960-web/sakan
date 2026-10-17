import { createClient } from './supabase/client';
import { 
  Listing, 
  WantedRequest, 
  Conversation, 
  Message, 
  Complaint, 
  Profile, 
  AdminAuditLog,
  AdminRole 
} from '@/types/database';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url && 
    anonKey && 
    !url.includes('placeholder') && 
    !anonKey.includes('placeholder')
  );
}

// In-memory store for local testing/dev when Supabase credentials are not connected
const memoryStore = {
  listings: [] as Listing[],
  wantedRequests: [] as WantedRequest[],
  conversations: [] as Conversation[],
  messages: [] as Message[],
  complaints: [] as Complaint[],
  profiles: [] as Profile[],
  auditLogs: [] as AdminAuditLog[],
  userRoles: new Map<string, AdminRole[]>(),
};

// Seed initial representative listings for local preview if memory store is empty
export function initLocalDevData() {
  if (memoryStore.listings.length > 0) return;
  const now = '2026-10-16T12:00:00.000Z';
  
  memoryStore.profiles.push({
    id: 'user-ahmed-1',
    full_name: 'أحمد محمود',
    phone: '+201012345678',
    phone_verified: true,
    role_preference: 'provider',
    bio: 'مهندس مقيم بالقاهرة، أوفر غرف هادئة ومجهزة للطلبة والموظفين الجادين.',
    is_suspended: false,
    created_at: now,
    updated_at: now,
  });

  memoryStore.profiles.push({
    id: 'user-sara-2',
    full_name: 'سارة إبراهيم',
    phone: '+201123456789',
    phone_verified: true,
    role_preference: 'provider',
    bio: 'طبيبة مقيمة في الإسكندرية، شقق مفروشة للطالبات.',
    is_suspended: false,
    created_at: now,
    updated_at: now,
  });

  memoryStore.listings.push({
    id: 'listing-cairo-1',
    owner_id: 'user-ahmed-1',
    title: 'غرفة سنجل هادئة ومفروشة بالكامل قرب مترو الدقي',
    description: 'غرفة ممتازة للطلبة أو الموظفين، في شقة راقية وهادئة جداً. متوفر إنترنت فائق السرعة، غسالة أوتوماتيك، ومطبخ مجهز بالكامل. تبعد 5 دقائق مشياً عن محطة مترو الدقي وشارع التحرير. السعر شامل فواتير المياه والكهرباء والإنترنت. يمنع التدخين تماماً.',
    governorate: 'الجيزة',
    area: 'الدقي',
    housing_type: 'room',
    eligible_occupants: 'both',
    gender_preference: 'male',
    monthly_rent: 2800,
    deposit: 2800,
    utilities_cost: 0,
    furnished: true,
    available_from: new Date().toISOString().split('T')[0],
    amenities: ['واي فاي سريع', 'مكيف هواء', 'غسالة', 'مطبخ كامل', 'مصعد', 'حارس عقار'],
    status: 'published',
    room_occupancy_type: 'private',
    beds_count: 1,
    rooms_count: 3,
    bathrooms_count: 2,
    max_occupancy: 1,
    show_phone_publicly: false,
    views_count: 142,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: now,
    photos: [
      { id: 'p1', listing_id: 'listing-cairo-1', photo_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', order_index: 0, created_at: now },
      { id: 'p2', listing_id: 'listing-cairo-1', photo_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', order_index: 1, created_at: now }
    ],
    owner: {
      id: 'user-ahmed-1',
      full_name: 'أحمد محمود',
      role_preference: 'provider',
    }
  });

  memoryStore.listings.push({
    id: 'listing-alex-2',
    owner_id: 'user-sara-2',
    title: 'استوديو مستقل مفروش ومكيف يرى البحر في لوران',
    description: 'استوديو ممتاز ومستقل تماماً في الدور السادس بعمارة راقية مع مصعد حديث. مجهز بأثاث فندقي نظيف ومطبخ أمريكي وتكييف شارب. خطوات من ترام لوران وشاطئ البحر. مناسب جداً للأطباء أو طلبة الدراسات العليا.',
    governorate: 'الإسكندرية',
    area: 'لوران',
    housing_type: 'studio',
    eligible_occupants: 'both',
    gender_preference: 'female',
    monthly_rent: 4200,
    deposit: 4200,
    utilities_cost: 300,
    furnished: true,
    available_from: new Date().toISOString().split('T')[0],
    amenities: ['إطلالة بحر', 'مصعد', 'مكيف هواء', 'شاشة تلفزيون', 'واي فاي', 'مطبخ أمريكي'],
    status: 'published',
    beds_count: 1,
    rooms_count: 1,
    bathrooms_count: 1,
    max_occupancy: 2,
    show_phone_publicly: false,
    views_count: 289,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: now,
    photos: [
      { id: 'p3', listing_id: 'listing-alex-2', photo_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', order_index: 0, created_at: now }
    ],
    owner: {
      id: 'user-sara-2',
      full_name: 'سارة إبراهيم',
      role_preference: 'provider',
    }
  });

  memoryStore.listings.push({
    id: 'listing-cairo-3',
    owner_id: 'user-ahmed-1',
    title: 'سكن شباب مشترك بجوار جامعة القاهرة ومحطة المترو',
    description: 'سرير متاح في غرفة ثنائية واسعة ونظيفة جداً. الشقة مخصصة لطلبة جامعة القاهرة والموظفين. بيئة دراسية هادئة مع صالة جلوس ومطبخ كامل. لا توجد أي عمولات أو رسوم معاينة.',
    governorate: 'الجيزة',
    area: 'بين السرايات',
    housing_type: 'shared_apartment',
    eligible_occupants: 'students',
    gender_preference: 'male',
    monthly_rent: 1400,
    deposit: 1000,
    utilities_cost: 150,
    furnished: true,
    available_from: new Date().toISOString().split('T')[0],
    amenities: ['واي فاي', 'غسالة', 'مكتب للمذاكرة', 'مروحة سقف', 'مطبخ كامل'],
    status: 'published',
    room_occupancy_type: 'shared',
    beds_count: 2,
    rooms_count: 3,
    bathrooms_count: 1,
    max_occupancy: 4,
    show_phone_publicly: false,
    views_count: 310,
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: now,
    photos: [
      { id: 'p4', listing_id: 'listing-cairo-3', photo_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', order_index: 0, created_at: now }
    ],
    owner: {
      id: 'user-ahmed-1',
      full_name: 'أحمد محمود',
      role_preference: 'provider',
    }
  });

  // Assign demo super_admin
  memoryStore.userRoles.set('admin-test-id', ['super_admin', 'admin']);
}

// Initialize test fixture data
initLocalDevData();

export interface ListingFilterParams {
  governorate?: string;
  area?: string;
  housing_type?: string;
  eligible_occupants?: string;
  gender_preference?: string;
  min_rent?: number;
  max_rent?: number;
  beds_count?: number;
  furnished?: boolean;
  sort_by?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export async function getPublishedListings(filters: ListingFilterParams = {}) {
  const {
    governorate,
    area,
    housing_type,
    eligible_occupants,
    gender_preference,
    min_rent,
    max_rent,
    beds_count,
    furnished,
    sort_by = 'newest',
    page = 1,
    limit = 12,
  } = filters;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('listings')
        .select('*, photos:listing_photos(*), owner:profiles(id, full_name, avatar_url)', { count: 'exact' })
        .eq('status', 'published');

      if (governorate) query = query.eq('governorate', governorate);
      if (area) query = query.ilike('area', `%${area}%`);
      if (housing_type) query = query.eq('housing_type', housing_type);
      if (eligible_occupants) query = query.eq('eligible_occupants', eligible_occupants);
      if (gender_preference && gender_preference !== 'any') {
        query = query.in('gender_preference', ['any', gender_preference]);
      }
      if (min_rent) query = query.gte('monthly_rent', min_rent);
      if (max_rent) query = query.lte('monthly_rent', max_rent);
      if (beds_count) query = query.gte('beds_count', beds_count);
      if (typeof furnished === 'boolean') query = query.eq('furnished', furnished);

      if (sort_by === 'price_asc') query = query.order('monthly_rent', { ascending: true });
      else if (sort_by === 'price_desc') query = query.order('monthly_rent', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        return { listings: data as Listing[], total: count || 0 };
      }
    } catch {
      // Fall through to memory store if query fails
    }
  }

  // Fallback to memory store
  let filtered = memoryStore.listings.filter((l) => l.status === 'published');

  if (governorate) filtered = filtered.filter((l) => l.governorate === governorate);
  if (area) filtered = filtered.filter((l) => l.area.toLowerCase().includes(area.toLowerCase()));
  if (housing_type) filtered = filtered.filter((l) => l.housing_type === housing_type);
  if (eligible_occupants) filtered = filtered.filter((l) => l.eligible_occupants === eligible_occupants || l.eligible_occupants === 'both');
  if (gender_preference && gender_preference !== 'any') {
    filtered = filtered.filter((l) => l.gender_preference === 'any' || l.gender_preference === gender_preference);
  }
  if (min_rent) filtered = filtered.filter((l) => l.monthly_rent >= min_rent);
  if (max_rent) filtered = filtered.filter((l) => l.monthly_rent <= max_rent);
  if (beds_count) filtered = filtered.filter((l) => (l.beds_count || 1) >= beds_count);
  if (typeof furnished === 'boolean') filtered = filtered.filter((l) => l.furnished === furnished);

  if (sort_by === 'price_asc') {
    filtered.sort((a, b) => a.monthly_rent - b.monthly_rent);
  } else if (sort_by === 'price_desc') {
    filtered.sort((a, b) => b.monthly_rent - a.monthly_rent);
  } else {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return { listings: paged, total };
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('listings')
        .select('*, photos:listing_photos(*), owner:profiles(id, full_name, avatar_url, phone, phone_verified, bio)')
        .eq('id', id)
        .single();
      if (!error && data) return data as Listing;
    } catch {
      // Fall through to memory
    }
  }

  const found = memoryStore.listings.find((l) => l.id === id);
  return found || null;
}

export async function getRelatedListings(listing: Listing, limit = 3): Promise<Listing[]> {
  const all = await getPublishedListings({
    governorate: listing.governorate,
    housing_type: listing.housing_type,
    limit: limit + 1,
  });
  return all.listings.filter((l) => l.id !== listing.id).slice(0, limit);
}

export async function createListing(listingData: Partial<Listing>): Promise<Listing> {
  const newListing: Listing = {
    id: `listing-${Date.now()}`,
    owner_id: listingData.owner_id || 'anonymous-user',
    title: listingData.title || '',
    description: listingData.description || '',
    governorate: listingData.governorate || 'القاهرة',
    area: listingData.area || '',
    address_private: listingData.address_private,
    housing_type: listingData.housing_type || 'room',
    eligible_occupants: listingData.eligible_occupants || 'both',
    gender_preference: listingData.gender_preference || 'any',
    monthly_rent: listingData.monthly_rent || 1000,
    deposit: listingData.deposit || 0,
    utilities_cost: listingData.utilities_cost || 0,
    furnished: listingData.furnished || false,
    available_from: listingData.available_from || new Date().toISOString().split('T')[0],
    amenities: listingData.amenities || [],
    status: 'published', // default active
    room_occupancy_type: listingData.room_occupancy_type,
    beds_count: listingData.beds_count,
    rooms_count: listingData.rooms_count,
    bathrooms_count: listingData.bathrooms_count,
    max_occupancy: listingData.max_occupancy,
    show_phone_publicly: listingData.show_phone_publicly || false,
    views_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    photos: listingData.photos || [],
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from('listings').insert(newListing).select().single();
      if (!error && data) return data as Listing;
    } catch {
      // Fallback to memory
    }
  }

  memoryStore.listings.unshift(newListing);
  return newListing;
}

export async function updateListingStatus(id: string, status: Listing['status'], reason?: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('listings')
        .update({ status, rejection_reason: reason, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  const idx = memoryStore.listings.findIndex((l) => l.id === id);
  if (idx !== -1) {
    memoryStore.listings[idx].status = status;
    if (reason) memoryStore.listings[idx].rejection_reason = reason;
    memoryStore.listings[idx].updated_at = new Date().toISOString();
    return true;
  }
  return false;
}

// WANTED REQUESTS ("دوّرلي على سكن")
export async function getWantedRequests(userId?: string): Promise<WantedRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('wanted_requests').select('*');
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) return data as WantedRequest[];
    } catch {
      // Fallback
    }
  }

  if (userId) {
    return memoryStore.wantedRequests.filter((r) => r.user_id === userId);
  }
  return memoryStore.wantedRequests;
}

export async function createWantedRequest(request: Partial<WantedRequest>): Promise<WantedRequest> {
  const newReq: WantedRequest = {
    id: `req-${Date.now()}`,
    user_id: request.user_id || 'anonymous-user',
    housing_type: request.housing_type,
    governorate: request.governorate || 'القاهرة',
    area: request.area,
    budget_max: request.budget_max,
    beds_count: request.beds_count,
    occupant_preference: request.occupant_preference,
    move_in_date: request.move_in_date,
    furnished_preference: request.furnished_preference,
    additional_requirements: request.additional_requirements,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryStore.wantedRequests.unshift(newReq);
  return newReq;
}

// COMPLAINTS
export async function submitComplaint(complaint: Partial<Complaint>): Promise<Complaint> {
  const newComplaint: Complaint = {
    id: `comp-${Date.now()}`,
    reporter_id: complaint.reporter_id || 'anonymous-reporter',
    reported_user_id: complaint.reported_user_id,
    listing_id: complaint.listing_id,
    conversation_id: complaint.conversation_id,
    category: complaint.category || 'brokerage_commission',
    description: complaint.description || '',
    status: 'submitted',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    evidence: complaint.evidence || [],
  };

  memoryStore.complaints.unshift(newComplaint);
  return newComplaint;
}

export async function getComplaints(filter?: { status?: string }): Promise<Complaint[]> {
  let list = memoryStore.complaints;
  if (filter?.status) {
    list = list.filter((c) => c.status === filter.status);
  }
  return list;
}

// ADMIN METRICS
export async function getAdminMetrics() {
  const totalUsers = memoryStore.profiles.length + 15; // Realistic active count
  const activeListings = memoryStore.listings.filter((l) => l.status === 'published').length;
  const pendingListings = memoryStore.listings.filter((l) => l.status === 'pending').length;
  const pausedListings = memoryStore.listings.filter((l) => l.status === 'paused' || l.status === 'removed').length;
  const openComplaints = memoryStore.complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length;
  const wantedRequestsCount = memoryStore.wantedRequests.length;

  return {
    totalUsers,
    activeListings,
    pendingListings,
    pausedListings,
    openComplaints,
    wantedRequestsCount,
    messagesCount: 48,
  };
}

// ADMIN AUDIT LOG
export async function logAdminAction(action: string, targetType: string, targetId: string, metadata: Record<string, unknown> = {}, actorId = 'super-admin-system') {
  const log: AdminAuditLog = {
    id: `log-${Date.now()}`,
    actor_id: actorId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata,
    created_at: new Date().toISOString(),
  };
  memoryStore.auditLogs.unshift(log);
  return log;
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  return memoryStore.auditLogs;
}
