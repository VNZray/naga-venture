export interface TouristSpotFormData {
  name: string;
  description: string;
  spot_type: string;
  address: string;
  city: string;
  province: string;
  latitude: string; // Assuming input as string for lat/lng
  longitude: string; // Assuming input as string for lat/lng
  contact_phone: string;
  contact_email: string;
  website: string;
  opening_time: string;
  closing_time: string;
  entry_fee: string; // Input as string, convert to number on submit
}
