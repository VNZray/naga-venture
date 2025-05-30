import { reviewsData } from '@/app/(tabs)/(home)/(touristSpots)/reviewsData';
import { touristSpotsData } from '@/app/(tabs)/(home)/(touristSpots)/TouristSpotData';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

// Types
export type Review = {
  id: string;
  spotId: string;
  userId: number;
  reviewerName: string;
  reviewText: string;
  rating: number;
  reviewDate: string;
  profileImageUri: string;
};

export type TouristSpot = typeof touristSpotsData[string];

export type TouristSpotWithRatings = TouristSpot & {
  rating: number;
  ratingCount: number;
  ratingDistribution: { [key: number]: number };
};

interface TouristSpotContextType {
  getSpotWithRatings: (spotId: string) => TouristSpotWithRatings | null;
  getReviews: (spotId: string) => Review[];
  addReview: (review: Review) => void;
}

const TouristSpotContext = createContext<TouristSpotContextType | undefined>(undefined);

export const TouristSpotProvider = ({ children }: { children: ReactNode }) => {
  // In-memory reviews (new reviews added during session)
  const [reviewsStore, setReviewsStore] = useState<Review[]>([]);

  // Combine static and in-memory reviews for a spot
  const getAllReviewsForSpot = useCallback((spotId: string) => [
    ...reviewsData.filter(r => r.spotId === spotId),
    ...reviewsStore.filter(r => r.spotId === spotId)
  ], [reviewsStore]);

  // Calculate ratings using all reviews
  const calculateSpotRatings = useCallback((spotId: string) => {
    const spotReviews = getAllReviewsForSpot(spotId);
    const ratingCount = spotReviews.length;
    if (ratingCount === 0) {
      return {
        rating: 0,
        ratingCount: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const totalRating = spotReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratingCount;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    spotReviews.forEach(r => { ratingDistribution[r.rating]++; });
    return { rating: averageRating, ratingCount, ratingDistribution };
  }, [getAllReviewsForSpot]);

  // Get spot with ratings
  const getSpotWithRatings = useCallback((spotId: string): TouristSpotWithRatings | null => {
    const spot = touristSpotsData[spotId];
    if (!spot) return null;
    const ratings = calculateSpotRatings(spotId);
    return {
      ...spot,
      rating: ratings.rating,
      ratingCount: ratings.ratingCount,
      ratingDistribution: ratings.ratingDistribution
    };
  }, [calculateSpotRatings]);

  // Get all reviews for a spot
  const getReviews = useCallback((spotId: string) => getAllReviewsForSpot(spotId), [getAllReviewsForSpot]);

  // Add a new review
  const addReview = useCallback((review: Review) => {
    setReviewsStore(prev => [...prev, review]);
  }, []);

  return (
    <TouristSpotContext.Provider value={{ getSpotWithRatings, getReviews, addReview }}>
      {children}
    </TouristSpotContext.Provider>
  );
};

export const useTouristSpots = () => {
  const context = useContext(TouristSpotContext);
  if (!context) {
    throw new Error('useTouristSpots must be used within a TouristSpotProvider');
  }
  return context;
}; 