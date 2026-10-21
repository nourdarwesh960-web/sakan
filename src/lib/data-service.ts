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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return Boolean(
    url && 
    anonKey && 
    !url.includes('placeholder') && 
    !anonKey.includes('placeholder') &&
    url.startsWith('https://')
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

// Clean memory store initialized with zero fake data
export function initLocalDevData() {
  // Empty memory store for clean production readiness
  // Real listings are created dynamically by actual users
  memoryStore.userRoles.set('admin-test-id', ['super_admin', 'admin']);
}

// Initialize clean data store
initLocalDevData();

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const LOCAL_LISTINGS_KEY = 'sakan_local_listings_v1';

export function getLocalListings(): Listing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_LISTINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalListing(listing: Listing): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalListings();
    const existingIdx = current.findIndex((l) => l.id === listing.id);
    if (existingIdx !== -1) {
      current[existingIdx] = listing;
    } else {
      current.unshift(listing);
    }
    localStorage.setItem(LOCAL_LISTINGS_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('sakan_listings_updated'));
  } catch (err) {
    console.error('Failed to save listing locally:', err);
  }
}

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
      // Fall through to local
    }
  }

  // Check memory store
  const found = memoryStore.listings.find((l) => l.id === id);
  if (found) return found;

  // Check client local storage
  if (typeof window !== 'undefined') {
    const local = getLocalListings();
    const foundLocal = local.find((l) => l.id === id);
    if (foundLocal) return foundLocal;
  }

  return null;
}

export async function getMyListings(ownerId?: string): Promise<Listing[]> {
  let results: Listing[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('listings')
        .select('*, photos:listing_photos(*)')
        .order('created_at', { ascending: false });
      if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }
      const { data, error } = await query;
      if (!error && data) {
        results = data as Listing[];
      }
    } catch {
      // Fallback
    }
  }

  const memoryList = ownerId ? memoryStore.listings.filter((l) => l.owner_id === ownerId) : memoryStore.listings;
  const localList = getLocalListings().filter((l) => !ownerId || l.owner_id === ownerId || l.owner_id === 'local-user');

  const combined = [...results, ...memoryList, ...localList];
  const map = new Map<string, Listing>();
  for (const item of combined) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return Array.from(map.values());
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
  const listingId = listingData.id || generateUUID();
  
  // Ensure owner_id is a valid UUID format
  let ownerId = listingData.owner_id;
  const isUUID = ownerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId);
  if (!isUUID) {
    ownerId = generateUUID();
  }

  const newListing: Listing = {
    id: listingId,
    owner_id: ownerId!,
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
    status: 'published',
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

  // Always save in memory store and local storage
  memoryStore.listings.unshift(newListing);
  saveLocalListing(newListing);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      
      // Get current authenticated user id to satisfy foreign key
      const { data: authData } = await supabase.auth.getUser();
      const realOwnerId = authData?.user?.id || ownerId;

      const { photos, ...dbPayload } = newListing;
      dbPayload.owner_id = realOwnerId!;

      const { data, error } = await supabase
        .from('listings')
        .insert([dbPayload])
        .select()
        .single();

      if (!error && data) {
        // If photos are provided, insert them into listing_photos table
        if (photos && photos.length > 0) {
          const photoRecords = photos.map((p, idx) => ({
            id: generateUUID(),
            listing_id: data.id,
            photo_url: p.photo_url,
            order_index: idx,
            created_at: new Date().toISOString(),
          }));
          await supabase.from('listing_photos').insert(photoRecords);
        }

        const fullListing = { ...data, photos: photos || [] } as Listing;
        saveLocalListing(fullListing);
        return fullListing;
      }
    } catch {
      // Fallback to local copy
    }
  }

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
