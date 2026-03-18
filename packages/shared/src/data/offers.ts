import type { Offer } from '../types';
import { query } from '../db';

// Function to get all offers
export async function getOffers(): Promise<Offer[]> {
  return await query.all('SELECT * FROM offers') as Offer[];
}

// Function to get offer by ID
export async function getOfferById(id: string): Promise<Offer | null> {
  return await query.get('SELECT * FROM offers WHERE id = ?', [id]) as Offer | null;
}

// For backward compatibility, keep the old array but load from DB
// Note: This will be empty in production until we call getOffers()
export const offers: Offer[] = [];
