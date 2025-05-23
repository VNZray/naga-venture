// app/(tabs)/(home)/(touristSpots)/data.js

export const touristSpotsData = {
  1: {
    id: "1",
    name: "Naga Metropolitan Cathedral",
    category: "historical",
    description:
      "Metropolitan Cathedral and Parish of Saint John the Evangelist, commonly known as the Naga Metropolitan Cathedral. It is the seat of the Roman Catholic Archdiocese of Caceres.",
    image:
      "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/05/Cathedral-Exterior_1-scaled.jpg?resize=768%2C576&ssl=1",
    rating: 5,
    ratingCount: 150,
    reviews: [],
    additionalImages: [],
    location: "Somewhere in the Philippines",
    mapLocation: { latitude: 13.6276, longitude: 123.1917 },
    contact: "+63 (54) 473-8022",
    openingHours: "Open 24 hours",
    admissionFee: "Free",
  },
  2: {
    id: "2",
    name: "The Porta Mariae",
    category: "historical",
    description:
      'The Porta Mariae (Latin for "Door of Mary") is a devotional landmark built to commemorate the tercentenary of devotion to Our Lady of Peñafrancia.',
    image:
      "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/05/Porta-mariae-e1717984426731.jpg?resize=768%2C506&ssl=1",
    rating: 4.5,
    ratingCount: 120,
    reviews: [],
    additionalImages: [],
    location: "Somewhere in the Philippines",
    mapLocation: { latitude: 13.6316, longitude: 123.1954 },
    contact: "N/A",
    openingHours: "Open 24 hours",
    admissionFee: "Free",
  },
  3: {
    id: "3",
    name: "Mt. Isarog National Park",
    category: "natural",
    description:
      "Mount Isarog is a potentially active stratovolcano located in the province of Camarines Sur, Philippines.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Mount_Isarog_View_at_Antipolo_Baao_Camarines_Sur.jpg/1200px-Mount_Isarog_View_at_Antipolo_Baao_Camarines_Sur.jpg",
    rating: 4.7,
    ratingCount: 95,
    reviews: [],
    additionalImages: [],
    location: "Somewhere in the Philippines",
    mapLocation: { latitude: 13.6783, longitude: 123.375 },
    contact: "DENR Region V",
    openingHours: "Varies",
    admissionFee: "₱50",
  },
  4: {
    id: "4",
    name: "Malabsay Falls",
    category: "natural",
    description:
      "A breathtaking waterfall located within Mt. Isarog National Park, offering scenic views and a refreshing escape into nature.",
    image:
      "https://www.nagacityguide.com/wordpress/wp-content/uploads/2016/04/Jomari-Dumalasa%E2%80%8E2.jpg",
    rating: 4.6,
    ratingCount: 80,
    reviews: [],
    additionalImages: [],
    location: "Somewhere in the Philippines",
    mapLocation: { latitude: 13.6694, longitude: 123.3757 },
    contact: "DENR Region V",
    openingHours: "6:00 AM - 6:00 PM",
    admissionFee: "₱20",
  },
  5: {
    id: "5",
    name: "Penafrancia Church",
    category: "historical",
    description:
      "The Basilica of Our Lady of Peñafrancia, an important religious site and a center of Marian devotion in the Bicol region.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnRaPJ69VGxcYiD5EJbI5oLuJ9zy6m3tq3RA&shttps://www2.naga.gov.ph/wp-content/uploads/2022/08/20220704-VIC06248-1024x683.jpg",
    rating: 4.9,
    ratingCount: 200,
    reviews: [],
    additionalImages: [],
    location: "Somewhere in the Philippines",
    mapLocation: { latitude: 13.6311, longitude: 123.1978 },
    contact: "+63 (54) 472-5723",
    openingHours: "5:00 AM - 9:00 PM",
    admissionFee: "Free",
  },
  6: {
    id: "6",
    name: "Panicuason Hot Springs Resort",
    category: "resorts",
    description:
      "A relaxing hot spring resort tucked within the lush greenery of Mt. Isarog, perfect for rejuvenation and adventure.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG0ngeduQIbdqDtRb3zqWEnjzGQFoh78-Xpg&s",
    rating: 4.7,
    ratingCount: 110,
    reviews: [],
    additionalImages: [],
    location: "Somewhere in the Philippines",
    mapLocation: { latitude: 13.6723, longitude: 123.3769 },
    contact: "+63 (54) 473-0414",
    openingHours: "7:00 AM - 9:00 PM",
    admissionFee: "₱150",
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

export const destinations = Object.values(touristSpotsData)
  .slice(0, )
  .map((spot) => ({
    id: spot.id,
    name: spot.name,
    image: spot.image,
  }));
