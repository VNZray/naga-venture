import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { accommodations as staticAccommodationsData, rooms as staticRoomsData } from "@/app/Controller/AccommodationData";

// Types
type Room = {
  id: number;
  roomNumber: number;
  capacity: number;
  status: string;
  roomPrice: number;
  roomImage: string;
  ratings: number;
  accommodationId: number;
  description: string;
};

type Accommodation = {
  id: number;
  name: string;
  location: string;
  priceRange: string;
  imageUri: string;
  description: string;
  ratings: number;
  rooms: Room[];
};

type AccommodationContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (query: string) => void;
  filteredAccommodations: Accommodation[];
  loading: boolean;
};

const AccommodationContext = createContext<AccommodationContextType | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AccommodationProvider = ({ children }: ProviderProps) => {
  const [search, setSearch] = useState<string>("");
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Combine accommodations with their rooms
  const combinedAccommodations: Accommodation[] = staticAccommodationsData.map((acc) => ({
    ...acc,
    rooms: staticRoomsData.filter((room) => room.accommodationId === acc.id),
  }));

  useEffect(() => {
    setFilteredAccommodations(combinedAccommodations);
  }, []);

  const handleSearch = (query: string) => {
    setLoading(true);
    setSearch(query);

    setTimeout(() => {
      const lowerSearch = query.toLowerCase();
      const filtered = combinedAccommodations.filter((acc) => {
        return (
          acc.name.toLowerCase().includes(lowerSearch) ||
          acc.location.toLowerCase().includes(lowerSearch)
        );
      });

      setFilteredAccommodations(filtered);
      setLoading(false);
    }, 800);
  };

  return (
    <AccommodationContext.Provider
      value={{
        search,
        setSearch,
        handleSearch,
        filteredAccommodations,
        loading,
      }}
    >
      {children}
    </AccommodationContext.Provider>
  );
};

export const useAccommodation = () => {
  const context = useContext(AccommodationContext);
  if (!context) {
    throw new Error("useAccommodation must be used within an AccommodationProvider");
  }
  return context;
};
