import { EventFormData } from '@/types/event';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface EventContextType {
  events: EventFormData[];
  addEvent: (event: EventFormData) => void;
  updateEvent: (id: string, updates: Partial<EventFormData>) => void;
  findEvent: (id: string) => EventFormData | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialEvents: EventFormData[] = [
  {
    id: 'e1a2b3c4-d5e6-7890-1234-567890abcdef',
    name: 'Naga City Arts Festival',
    description: 'A vibrant festival showcasing the rich culture and arts of Naga City.',
    event_type: 'cultural',
    address: 'Plaza Quince Martires, Naga City',
    city: 'Naga City',
    province: 'Camarines Sur',
    latitude: '13.6213',
    longitude: '123.1870',
    contact_phone: '09123456789',
    contact_email: 'artsfest@example.com',
    website: 'www.nagacityarts.com',
    start_date: '2024-06-01',
    start_time: '09:00',
    end_date: '2024-06-07',
    end_time: '17:00',
    entry_fee: '0',
    picture: 'https://picsum.photos/id/237/200/300',
  },
  {
    id: 'f1g2h3i4-j5k6-7890-1234-567890ghijkl',
    name: 'Bicol Food Fair',
    description: 'Experience the authentic flavors of Bicol in this annual food fair.',
    event_type: 'food',
    address: 'SM City Naga, Naga City',
    city: 'Naga City',
    province: 'Camarines Sur',
    latitude: '13.6200',
    longitude: '123.1890',
    contact_phone: '09987654321',
    contact_email: 'foodfair@example.com',
    website: 'www.bicolfoodfair.com',
    start_date: '2024-07-10',
    start_time: '10:00',
    end_date: '2024-07-15',
    end_time: '21:00',
    entry_fee: '50',
    picture: 'https://picsum.photos/id/238/200/300',
  },
];

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventFormData[]>(initialEvents);

  const addEvent = (event: EventFormData) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (id: string, updates: Partial<EventFormData>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const findEvent = (id: string) => events.find((e) => e.id === id);

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, findEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
