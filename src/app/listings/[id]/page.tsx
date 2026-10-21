import React from 'react';
import { getListingById, getRelatedListings } from '@/lib/data-service';
import ListingDetailClient from '@/components/ListingDetailClient';

interface ListingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  const relatedListings = listing ? await getRelatedListings(listing, 3) : [];

  return (
    <ListingDetailClient
      id={id}
      initialListing={listing}
      relatedListings={relatedListings}
    />
  );
}
