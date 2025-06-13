import { TouristSpotType } from './TouristSpot';

export interface TouristSpotFormData {
  name: string;
  spot_type: TouristSpotType;
  latitude: string;
  longitude: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  website: string;
  description: string;
  highlights: string;
  how_to_get_there: string;
  best_time_to_visit: string;
  entry_fee: string;
  opening_time: string;
  closing_time: string;
}
