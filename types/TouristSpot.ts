export type TouristSpotStatus =
  | 'active'
  | 'inactive'
  | 'under_maintenance'
  | 'coming_soon';

export type TouristSpotType =
  | 'natural'
  | 'cultural'
  | 'historical'
  | 'religious'
  | 'recreational'
  | 'other';

export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  spot_type: TouristSpotType;
  address: string;
  city: string;
  province: string;
  location: { latitude: number; longitude: number };
  google_maps_place_id: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  opening_time: string | null;
  closing_time: string | null;
  entry_fee: number | null;
  status: TouristSpotStatus;
  is_featured: boolean;
  average_rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}
