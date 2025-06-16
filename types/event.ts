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
  contact_phone: string;
  contact_email: string;
  website: string;
  start_time: string;
  end_time: string;
  entry_fee: string;
  picture?: string;
};

export type EventStatus = 'pending' | 'approved' | 'rejected'; 