import {
  categories,
  touristSpotsData,
} from '@/app/TouristApp/(tabs)/(home)/(touristSpots)/TouristSpotData';
import { reviewsData } from '@/app/TouristApp/(tabs)/(home)/(touristSpots)/reviewsData';
import { supabase } from '@/utils/supabase';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

export type MapLocation = {
  latitude: number;
  longitude: number;
};
// Types
export type Review = {
  id: number;
  spotId: string;
  userId: number;
  reviewerName: string;
  reviewText: string;
  rating: number;
  reviewDate: string;
  profileImageUri: string;
};

export type TouristSpot = (typeof touristSpotsData)[string];

export type TouristSpotWithRatings = TouristSpot & {
  rating: number;
  ratingCount: number;
  ratingDistribution: { [key: number]: number };
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Destination = {
  id: string;
  name: string;
  image: string;
};

interface TouristSpotContextType {
  getSpotWithRatings: (spotId: string) => TouristSpotWithRatings | null;
  getReviews: (spotId: string) => Review[];
  addReview: (review: Review) => void;
  getAllSpots: () => TouristSpot[];
  getSpotsByCategory: (categoryId: string) => TouristSpot[];
  getCategories: () => Category[];
  getDestinations: () => Destination[];
  searchSpots: (query: string) => TouristSpot[];
}

const TouristSpotContext = createContext<TouristSpotContextType | undefined>(
  undefined
);

export const TouristSpotProvider = ({ children }: { children: ReactNode }) => {
  // In-memory reviews (new reviews added during session)
  const [reviewsStore, setReviewsStore] = useState<Review[]>([]);

  // Backend-supported tourist spots
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch spots from Supabase on mount
  React.useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('tourist_spots').select('*');
      if (error) {
        setError(error.message);
        setSpots([]);
      } else {
        // Map backend fields to frontend fields
        const mappedSpots = (data || []).map((spot) => ({
          ...spot,
          image: spot.picture, // map 'picture' to 'image'
          category: spot.spot_type,
          location: spot.address,
          contact: spot.contact_phone,
          openingHours:
            spot.opening_time && spot.closing_time
              ? `${spot.opening_time} - ${spot.closing_time}`
              : '',
          admissionFee: spot.admission_fee,
          additionalImages: spot.additional_images || [],
          mapLocation: spot.map_location || { latitude: 0, longitude: 0 },
        }));
        setSpots(mappedSpots);
      }
      setLoading(false);
    };
    fetchSpots();
  }, []);

  // Combine static and in-memory reviews for a spot
  const getAllReviewsForSpot = useCallback(
    (spotId: string) => [
      ...reviewsData.filter((r) => r.spotId === spotId),
      ...reviewsStore.filter((r) => r.spotId === spotId),
    ],
    [reviewsStore]
  );

  // Calculate ratings using all reviews
  const calculateSpotRatings = useCallback(
    (spotId: string) => {
      const spotReviews = getAllReviewsForSpot(spotId);
      const ratingCount = spotReviews.length;
      if (ratingCount === 0) {
        return {
          rating: 0,
          ratingCount: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      }
      const totalRating = spotReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / ratingCount;
      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      spotReviews.forEach((r) => {
        const rating = r.rating as keyof typeof ratingDistribution;
        ratingDistribution[rating]++;
      });
      return { rating: averageRating, ratingCount, ratingDistribution };
    },
    [getAllReviewsForSpot]
  );

  // Get spot with ratings (from backend)
  const getSpotWithRatings = useCallback(
    (spotId: string): TouristSpotWithRatings | null => {
      const spot = spots.find((s) => s.id === spotId);
      if (!spot) return null;
      const ratings = calculateSpotRatings(spotId);
      return {
        ...spot,
        rating: ratings.rating,
        ratingCount: ratings.ratingCount,
        ratingDistribution: ratings.ratingDistribution,
      };
    },
    [spots, calculateSpotRatings]
  );

  // Get all reviews for a spot
  const getReviews = useCallback(
    (spotId: string) => getAllReviewsForSpot(spotId),
    [getAllReviewsForSpot]
  );

  // Add a new review
  const addReview = useCallback((review: Review) => {
    setReviewsStore((prev) => [...prev, review]);
  }, []);

  // Get all tourist spots (from backend)
  const getAllSpots = useCallback(() => spots, [spots]);

  // Get spots by category (from backend)
  const getSpotsByCategory = useCallback(
    (categoryId: string) =>
      spots.filter((spot) => spot.category === categoryId),
    [spots]
  );

  // Get all categories (still static)
  const getCategories = useCallback(() => categories, []);

  // Get all destinations (from backend)
  const getDestinations = useCallback(() => {
    if (!spots || spots.length === 0) return [];
    return spots.map((spot) => ({
      id: spot.id,
      name: spot.name,
      image: spot.image,
    }));
  }, [spots]);

  // Search spots by name (from backend)
  const searchSpots = useCallback(
    (query: string) => {
      const searchQuery = query.toLowerCase().trim();
      return spots.filter((spot) =>
        spot.name.toLowerCase().includes(searchQuery)
      );
    },
    [spots]
  );

  return (
    <TouristSpotContext.Provider
      value={{
        getSpotWithRatings,
        getReviews,
        addReview,
        getAllSpots,
        getSpotsByCategory,
        getCategories,
        getDestinations,
        searchSpots,
      }}
    >
      {children}
    </TouristSpotContext.Provider>
  );
};

export const useTouristSpots = () => {
  const context = useContext(TouristSpotContext);
  if (!context) {
    throw new Error(
      'useTouristSpots must be used within a TouristSpotProvider'
    );
  }
  return context;
};
