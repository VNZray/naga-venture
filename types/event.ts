export type EventCategory = 'natural' | 'cultural' | 'historical' | 'religious' | 'recreational' | 'other';

export type EventFormData = {
  name: string;
  id?: string;
  description: string;
  event_type: EventCategory;
  address: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
  additional_locations?: Array<{
    address?: string;
    latitude: string;
    longitude: string;
  }>;
  contact_phone: string;
  contact_email: string;
  website: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  entry_fee: string;
  social_media: string;
  picture?: string;
  permits?: {
    barangay_clearance: DocumentFile | null;
    mayor_special_permit: DocumentFile | null;
    fire_safety_certificate?: DocumentFile | null;
    sanitary_permit?: DocumentFile | null;
    zoning_clearance?: DocumentFile | null;
    others?: DocumentFile[];
  };
};

export type EventStatus = 'pending' | 'approved' | 'rejected'; 

export type DocumentFile = {
  uri: string; // blob/object URL for web preview or remote URL
  name: string;
  mimeType: 'application/pdf' | 'image/png' | 'image/jpeg';
  sizeBytes?: number;
};