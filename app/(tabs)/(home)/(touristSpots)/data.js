// app/(tabs)/home/(touristSpots)/data.js

export const touristSpotsData = {
  "1": {
    id: "1",
    name: "Naga Metropolitan Cathedral",
    category: "historical",
    description: "Metropolitan Cathedral and Parish of Saint John the Evangelist, commonly known as the Naga Metropolitan Cathedral. It is the seat of the Roman Catholic Archdiocese of Caceres.",
    image: "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/05/Cathedral-Exterior_1-scaled.jpg?resize=768%2C576&ssl=1",
    rating: 4.8,
    ratingCount: 150,
    reviews: [],
    additionalImages: [],
    mapLocation: { latitude: 13.6276, longitude: 123.1917 },
    contact: "+63 (54) 473-8022",
    openingHours: "Open 24 hours",
    admissionFee: "Free",
  },
  "2": {
    id: "2",
    name: "The Porta Mariae",
    category: "historical",
    description: "The Porta Mariae (Latin for \"Door of Mary\") is a devotional landmark built to commemorate the tercentenary of devotion to Our Lady of Peñafrancia.",
    image: "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/05/Porta-mariae-e1717984426731.jpg?resize=768%2C506&ssl=1",
    rating: 4.5,
    ratingCount: 120,
    reviews: [],
    additionalImages: [],
    mapLocation: { latitude: 13.6316, longitude: 123.1954 },
    contact: "N/A",
    openingHours: "Open 24 hours",
    admissionFee: "Free",
  },
  "3": {
    id: "3",
    name: "Mt. Isarog National Park",
    category: "natural",
    description: "Mount Isarog is a potentially active stratovolcano located in the province of Camarines Sur, Philippines.",
    image: "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/11/mt-isarog-national-park.jpg?resize=768%2C576&ssl=1",
    rating: 4.7,
    ratingCount: 95,
    reviews: [],
    additionalImages: [],
    mapLocation: { latitude: 13.6783, longitude: 123.3750 },
    contact: "DENR Region V",
    openingHours: "Varies",
    admissionFee: "₱50",
  },
  // Add more data here as needed
};

export const categories = [
  { id: "historical", name: "Historical", icon: "university" },
  { id: "natural", name: "Natural", icon: "tree" },
  { id: "urban", name: "Urban", icon: "building" },
  { id: "museums", name: "Museums", icon: "landmark" },
  { id: "resorts", name: "Resorts", icon: "umbrella-beach" },
];

export const featuredLocations = [
  touristSpotsData["1"],
  touristSpotsData["2"],
  touristSpotsData["3"],
];

export const destinations = Object.values(touristSpotsData).slice(0, 4).map(spot => ({
  id: spot.id,
  name: spot.name,
  image: spot.image,
}));