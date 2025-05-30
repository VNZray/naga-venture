// Data file containing review information and rating calculation functions
// Manages user reviews and provides helper functions for rating calculations

// Sample review data for tourist spots
export const reviewsData = [
  {
    id: 1,
    spotId: "1", // Naga Metropolitan Cathedral
    userId: 0,
    reviewerName: "Maria Santos",
    reviewText: "A beautiful and historic cathedral that showcases the rich religious heritage of Naga City. The architecture is stunning and the atmosphere is very peaceful.",
    reviewDate: "2024-05-15",
    rating: 5,
    profileImageUri: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    spotId: "1",
    userId: 0,
    reviewerName: "Juan Dela Cruz",
    reviewText: "One of the most important religious landmarks in Bicol. The cathedral's design and history make it a must-visit destination.",
    reviewDate: "2024-05-10",
    rating: 5,
    profileImageUri: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    spotId: "2", // Porta Mariae
    userId: 0,
    reviewerName: "Ana Reyes",
    reviewText: "A beautiful landmark that serves as a gateway to Naga City. The architecture is impressive and it's a great spot for photos.",
    reviewDate: "2024-05-18",
    rating: 4,
    profileImageUri: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: 4,
    spotId: "2",
    userId: 0,
    reviewerName: "Pedro Martinez",
    reviewText: "The Porta Mariae is a significant religious landmark. The design is beautiful and it's well-maintained.",
    reviewDate: "2024-05-12",
    rating: 5,
    profileImageUri: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 5,
    spotId: "3", // Mt. Isarog
    userId: 0,
    reviewerName: "Carlos Mendoza",
    reviewText: "An amazing hiking experience with breathtaking views. The trail is well-maintained and the guides are very helpful.",
    reviewDate: "2024-05-20",
    rating: 5,
    profileImageUri: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 6,
    spotId: "3",
    userId: 0,
    reviewerName: "Liza Garcia",
    reviewText: "The mountain offers spectacular views and diverse wildlife. A must-visit for nature lovers.",
    reviewDate: "2024-05-17",
    rating: 4,
    profileImageUri: "https://i.pravatar.cc/150?img=6"
  }
];

// Helper function to calculate ratings for a specific spot
// Computes average rating, total count, and rating distribution
export const calculateSpotRatings = (spotId: string) => {
  // Filter reviews for the specific spot
  const spotReviews = reviewsData.filter(review => review.spotId === spotId);
  const ratingCount = spotReviews.length;
  
  // Return default values if no reviews exist
  if (ratingCount === 0) {
    return {
      rating: 0,
      ratingCount: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };
  }

  // Calculate average rating
  const totalRating = spotReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / ratingCount;

  // Calculate distribution of ratings (how many reviews for each star rating)
  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  spotReviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

  return {
    rating: averageRating,
    ratingCount,
    ratingDistribution
  };
}; 