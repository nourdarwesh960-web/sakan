import { describe, it, expect } from 'vitest';
import { WantedRequest, Listing } from '../src/types/database';

describe('Wanted Requests Matching Engine ("دوّرلي على سكن")', () => {
  function matchListingToRequest(listing: Partial<Listing>, req: WantedRequest): boolean {
    if (!req.is_active) return false;
    if (listing.owner_id === req.user_id) return false;
    if (listing.governorate !== req.governorate) return false;
    if (req.housing_type && listing.housing_type !== req.housing_type) return false;
    if (req.budget_max && listing.monthly_rent && listing.monthly_rent > req.budget_max) return false;
    if (req.beds_count && listing.beds_count && listing.beds_count < req.beds_count) return false;
    if (typeof req.furnished_preference === 'boolean' && listing.furnished !== req.furnished_preference) return false;
    return true;
  }

  const baseRequest: WantedRequest = {
    id: 'req-test-1',
    user_id: 'user-student-1',
    governorate: 'الجيزة',
    housing_type: 'room',
    budget_max: 3000,
    beds_count: 1,
    furnished_preference: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('matches listing with identical criteria within budget', () => {
    const listing: Partial<Listing> = {
      owner_id: 'user-provider-9',
      governorate: 'الجيزة',
      housing_type: 'room',
      monthly_rent: 2800,
      beds_count: 1,
      furnished: true,
      status: 'published',
    };

    expect(matchListingToRequest(listing, baseRequest)).toBe(true);
  });

  it('rejects listing exceeding max budget', () => {
    const listing: Partial<Listing> = {
      owner_id: 'user-provider-9',
      governorate: 'الجيزة',
      housing_type: 'room',
      monthly_rent: 3500, // exceeds 3000
      beds_count: 1,
      furnished: true,
    };

    expect(matchListingToRequest(listing, baseRequest)).toBe(false);
  });

  it('rejects listing in a different governorate', () => {
    const listing: Partial<Listing> = {
      owner_id: 'user-provider-9',
      governorate: 'الإسكندرية', // different gov
      housing_type: 'room',
      monthly_rent: 2500,
      beds_count: 1,
      furnished: true,
    };

    expect(matchListingToRequest(listing, baseRequest)).toBe(false);
  });

  it('does not alert user of their own listing', () => {
    const listing: Partial<Listing> = {
      owner_id: 'user-student-1', // same user
      governorate: 'الجيزة',
      housing_type: 'room',
      monthly_rent: 2500,
      furnished: true,
    };

    expect(matchListingToRequest(listing, baseRequest)).toBe(false);
  });

  it('ignores matching if request is paused', () => {
    const pausedReq = { ...baseRequest, is_active: false };
    const listing: Partial<Listing> = {
      owner_id: 'user-provider-9',
      governorate: 'الجيزة',
      housing_type: 'room',
      monthly_rent: 2000,
      furnished: true,
    };

    expect(matchListingToRequest(listing, pausedReq)).toBe(false);
  });
});
