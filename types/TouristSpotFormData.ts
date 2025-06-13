import { TouristSpotType } from './TouristSpot';

export interface TouristSpotFormData {
  name: string;
  description: string;
  spot_type: TouristSpotType;
  address: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
  google_maps_place_id?: string;
  contact_phone: string;
  contact_email: string;
  website: string;
  opening_time: string;
  closing_time: string;
  entry_fee: string;
  picture?: string;
}
