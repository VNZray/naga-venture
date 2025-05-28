// Enhanced shop data structure similar to touristSpotsData
export const shopsData = {
  1: {
    id: "1",
    name: "Burger Joint",
    category: "dining",
    description: "A popular local burger joint serving freshly made burgers with locally sourced ingredients. Known for their signature Bicol Express Burger.",
    image: "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/11/ateneo-de-naga-university1.jpg?resize=768%2C512&ssl=1",
    rating: 4.5,
    ratingCount: 150,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80"
    ],
    location: "Magsaysay Avenue, Naga City",
    mapLocation: { latitude: 13.6218, longitude: 123.1948 },
    contact: "+63 (54) 472-1234",
    website: "www.burgerjoint-naga.com",
    openingHours: "10:00 AM - 10:00 PM",
    priceRange: "₱150 - ₱300",
    menu: [
      { item: "Classic Burger", price: "₱180" },
      { item: "Bicol Express Burger", price: "₱220" },
      { item: "Cheese Fries", price: "₱120" }
    ]
  },
  2: {
    id: "2",
    name: "Life's Kitchen",
    category: "dining",
    description: "A cozy family restaurant offering traditional Filipino dishes with a modern twist. Perfect for family gatherings and special occasions.",
    image: "https://cdn.pixabay.com/photo/2020/01/31/07/26/chef-4807317_1280.jpg",
    rating: 4.7,
    ratingCount: 200,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80"
    ],
    location: "Centro, Naga City",
    mapLocation: { latitude: 13.6194, longitude: 123.1956 },
    contact: "+63 (54) 473-5678",
    website: "www.lifeskitchen.ph",
    openingHours: "11:00 AM - 9:00 PM",
    priceRange: "₱200 - ₱500",
    menu: [
      { item: "Adobo Rice Bowl", price: "₱250" },
      { item: "Sisig Platter", price: "₱280" },
      { item: "Halo-Halo", price: "₱150" }
    ]
  },
  3: {
    id: "3",
    name: "Coffee Project",
    category: "cafe",
    description: "A modern coffee shop offering specialty coffee, pastries, and light meals. Popular among students and professionals for work and study sessions.",
    image: "https://cdn.pixabay.com/photo/2017/09/04/18/39/coffee-2714970_1280.jpg",
    rating: 4.3,
    ratingCount: 180,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80"
    ],
    location: "SM City Naga",
    mapLocation: { latitude: 13.6183, longitude: 123.1947 },
    contact: "+63 (54) 474-9012",
    website: "www.coffeeproject.com.ph",
    openingHours: "7:00 AM - 10:00 PM",
    priceRange: "₱100 - ₱250",
    menu: [
      { item: "Cappuccino", price: "₱140" },
      { item: "Iced Coffee", price: "₱120" },
      { item: "Blueberry Muffin", price: "₱95" }
    ]
  },
  4: {
    id: "4",
    name: "Overtime Bar",
    category: "bars",
    description: "A trendy sports bar with live music, craft beers, and cocktails. Great atmosphere for watching games and hanging out with friends.",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80",
    rating: 4.4,
    ratingCount: 120,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80"
    ],
    location: "Magsaysay Avenue, Naga City",
    mapLocation: { latitude: 13.6205, longitude: 123.1952 },
    contact: "+63 (54) 475-3456",
    website: "www.overtimebar-naga.com",
    openingHours: "5:00 PM - 2:00 AM",
    priceRange: "₱150 - ₱400",
    menu: [
      { item: "San Miguel Pale", price: "₱80" },
      { item: "House Cocktail", price: "₱200" },
      { item: "Buffalo Wings", price: "₱180" }
    ]
  },
  5: {
    id: "5",
    name: "Naga Souvenir Shop",
    category: "souvenir",
    description: "Your one-stop shop for authentic Naga and Bicol souvenirs. From traditional handicrafts to local delicacies and pasalubong items.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80",
    rating: 4.2,
    ratingCount: 95,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80",
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80"
    ],
    location: "Naga City People's Mall",
    mapLocation: { latitude: 13.6201, longitude: 123.1943 },
    contact: "+63 (54) 476-7890",
    website: "www.nagasouvenirs.com",
    openingHours: "9:00 AM - 8:00 PM",
    priceRange: "₱50 - ₱500",
    menu: [
      { item: "Bicol Express Pasalubong", price: "₱150" },
      { item: "Local Handicrafts", price: "₱200" },
      { item: "Naga City T-Shirt", price: "₱350" }
    ]
  },
  6: {
    id: "6",
    name: "Starbucks Naga",
    category: "cafe",
    description: "International coffee chain known for premium coffee beverages, pastries, and comfortable ambiance for meetings and relaxation.",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80",
    rating: 4.6,
    ratingCount: 250,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80"
    ],
    location: "SM City Naga",
    mapLocation: { latitude: 13.6185, longitude: 123.1945 },
    contact: "+63 (54) 477-0123",
    website: "www.starbucks.ph",
    openingHours: "7:00 AM - 10:00 PM",
    priceRange: "₱150 - ₱350",
    menu: [
      { item: "Caramel Macchiato", price: "₱195" },
      { item: "Pike Place Roast", price: "₱165" },
      { item: "Cheesecake", price: "₱185" }
    ]
  }
};

// Export for compatibility with existing code
export const ShopsData = Object.values(shopsData);

// Categories with icons matching the tourist spots pattern
export const categories = [
  { id: "dining", name: "Dining", icon: "utensils" },
  { id: "cafe", name: "Cafes", icon: "coffee" },
  { id: "bars", name: "Bars", icon: "wine-glass" },
  { id: "souvenir", name: "Souvenirs", icon: "gift" },
];

// Featured locations (first 3 shops)
export const featuredShops = [
  shopsData["1"],
  shopsData["2"],
  shopsData["3"],
];

// Destinations mapping for consistency with tourist spots
export const destinations = Object.values(shopsData);
