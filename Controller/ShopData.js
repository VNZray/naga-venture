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
    priceRange: "₱150 - ₱350",    menu: [
      { item: "Caramel Macchiato", price: "₱195" },
      { item: "Pike Place Roast", price: "₱165" },
      { item: "Cheesecake", price: "₱185" }
    ]
  },
  7: {
    id: "7",
    name: "Serenity Spa & Wellness",
    category: "spa",
    description: "A full-service spa offering massage therapy, facials, body treatments, and wellness services. Relax and rejuvenate in our tranquil environment.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80",
    rating: 4.8,
    ratingCount: 85,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80",
      "https://images.unsplash.com/photo-1559784558-71fb2b1fc36d?q=80"
    ],
    location: "Magsaysay Avenue, Naga City",
    mapLocation: { latitude: 13.6220, longitude: 123.1950 },
    contact: "+63 (54) 478-9012",
    website: "www.serenityspa-naga.com",
    openingHours: "9:00 AM - 8:00 PM",
    priceRange: "₱500 - ₱2,500",
    menu: [
      { item: "Swedish Massage (60 min)", price: "₱1,200" },
      { item: "Facial Treatment", price: "₱800" },
      { item: "Body Scrub", price: "₱1,000" }
    ]
  },
  8: {
    id: "8",
    name: "StyleCut Hair Salon",
    category: "salon",
    description: "Professional hair salon offering haircuts, styling, coloring, and hair treatments. Expert stylists with latest trends and techniques.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80",
    rating: 4.6,
    ratingCount: 125,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80"
    ],
    location: "SM City Naga",
    mapLocation: { latitude: 13.6180, longitude: 123.1940 },
    contact: "+63 (54) 479-3456",
    website: "www.stylecut-naga.com",
    openingHours: "8:00 AM - 7:00 PM",
    priceRange: "₱150 - ₱1,500",
    menu: [
      { item: "Haircut & Style", price: "₱250" },
      { item: "Hair Color", price: "₱800" },
      { item: "Hair Rebond", price: "₱1,200" }
    ]
  },
  9: {
    id: "9",
    name: "TechHub Computer Shop",
    category: "computer",
    description: "Complete computer solutions including sales, repair, upgrades, and technical support. We also offer custom PC builds and gaming setups.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
    rating: 4.4,
    ratingCount: 95,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1547968406-6a2d7f9a7a2f?q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80"
    ],
    location: "Centro, Naga City",
    mapLocation: { latitude: 13.6200, longitude: 123.1955 },
    contact: "+63 (54) 470-7890",
    website: "www.techhub-naga.com",
    openingHours: "9:00 AM - 7:00 PM",
    priceRange: "₱500 - ₱50,000",
    menu: [
      { item: "Computer Repair", price: "₱500" },
      { item: "Laptop Screen Replacement", price: "₱3,500" },
      { item: "Custom PC Build", price: "₱25,000" }
    ]
  },
  10: {
    id: "10",
    name: "QuickPrint Services",
    category: "printing",
    description: "Professional printing and copy services including documents, photos, business cards, banners, and promotional materials.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80",
    rating: 4.3,
    ratingCount: 78,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?q=80"
    ],
    location: "Peñafrancia Avenue, Naga City",
    mapLocation: { latitude: 13.6210, longitude: 123.1945 },
    contact: "+63 (54) 471-2345",
    website: "www.quickprint-naga.com",
    openingHours: "8:00 AM - 6:00 PM",
    priceRange: "₱5 - ₱500",
    menu: [
      { item: "Document Printing (A4)", price: "₱2" },
      { item: "Photo Printing (4x6)", price: "₱15" },
      { item: "Business Cards (100pcs)", price: "₱200" }
    ]
  },
  11: {
    id: "11",
    name: "GreenThumb Garden Center",
    category: "garden",
    description: "Complete garden center with plants, flowers, gardening tools, fertilizers, and landscaping supplies. Expert advice for all your gardening needs.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80",
    rating: 4.5,
    ratingCount: 67,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80"
    ],
    location: "Triangulo, Naga City",
    mapLocation: { latitude: 13.6215, longitude: 123.1960 },
    contact: "+63 (54) 472-5678",
    website: "www.greenthumb-naga.com",
    openingHours: "7:00 AM - 5:00 PM",
    priceRange: "₱50 - ₱2,000",
    menu: [
      { item: "Indoor Plants", price: "₱150" },
      { item: "Garden Tools Set", price: "₱500" },
      { item: "Organic Fertilizer", price: "₱200" }
    ]
  },
  12: {
    id: "12",
    name: "PetLove Animal Clinic & Shop",
    category: "pet",
    description: "Complete pet care services including veterinary clinic, pet grooming, pet supplies, and pet food. Caring for your furry family members.",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80",
    rating: 4.7,
    ratingCount: 112,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80"
    ],
    location: "Dayangdang, Naga City",
    mapLocation: { latitude: 13.6225, longitude: 123.1935 },
    contact: "+63 (54) 473-9012",
    website: "www.petlove-naga.com",
    openingHours: "8:00 AM - 6:00 PM",
    priceRange: "₱200 - ₱3,000",
    menu: [
      { item: "Pet Grooming", price: "₱500" },
      { item: "Veterinary Consultation", price: "₱300" },
      { item: "Pet Vaccination", price: "₱800" }
    ]
  },
  13: {
    id: "13",
    name: "Fresh Clean Laundry",
    category: "laundry",
    description: "Professional laundry and dry cleaning services. Self-service and full-service options available with same-day and next-day delivery.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80",
    rating: 4.2,
    ratingCount: 89,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80"
    ],
    location: "Bagumbayan Sur, Naga City",
    mapLocation: { latitude: 13.6190, longitude: 123.1930 },
    contact: "+63 (54) 474-3456",
    website: "www.freshclean-naga.com",
    openingHours: "6:00 AM - 9:00 PM",
    priceRange: "₱50 - ₱300",
    menu: [
      { item: "Wash & Dry (per kg)", price: "₱60" },
      { item: "Dry Cleaning", price: "₱150" },
      { item: "Express Service", price: "₱100" }
    ]
  },
  14: {
    id: "14",
    name: "AutoCare Service Center",
    category: "automotive",
    description: "Complete automotive services including oil change, tire services, brake repair, car wash, and general automotive maintenance.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80",
    rating: 4.4,
    ratingCount: 156,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80"
    ],
    location: "Magsaysay Avenue, Naga City",
    mapLocation: { latitude: 13.6230, longitude: 123.1965 },
    contact: "+63 (54) 475-7890",
    website: "www.autocare-naga.com",
    openingHours: "7:00 AM - 6:00 PM",
    priceRange: "₱300 - ₱5,000",
    menu: [
      { item: "Oil Change", price: "₱800" },
      { item: "Car Wash", price: "₱150" },
      { item: "Brake Service", price: "₱2,500" }
    ]
  },
  15: {
    id: "15",
    name: "NagaMed Pharmacy",
    category: "pharmacy",
    description: "24-hour pharmacy providing prescription medications, over-the-counter drugs, medical supplies, and health consultation services.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80",
    rating: 4.6,
    ratingCount: 203,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80",
      "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80"
    ],
    location: "General Luna Street, Naga City",
    mapLocation: { latitude: 13.6195, longitude: 123.1940 },
    contact: "+63 (54) 476-1234",
    website: "www.nagamed-pharmacy.com",
    openingHours: "24 Hours",
    priceRange: "₱20 - ₱2,000",
    menu: [
      { item: "Generic Medicines", price: "₱50" },
      { item: "Prescription Drugs", price: "₱200" },
      { item: "Medical Supplies", price: "₱100" }
    ]
  },
  16: {
    id: "16",
    name: "TechHub Computer Center",
    category: "computer",
    description: "Complete computer solutions including sales, repair, custom builds, and IT support services. Latest hardware and software available.",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80",
    rating: 4.5,
    ratingCount: 87,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80"
    ],
    location: "SM City Naga",
    mapLocation: { latitude: 13.6180, longitude: 123.1945 },
    contact: "+63 (54) 477-8901",
    website: "www.techhub-naga.com",
    openingHours: "9:00 AM - 8:00 PM",
    priceRange: "₱500 - ₱50,000",
    menu: [
      { item: "Computer Repair", price: "₱500" },
      { item: "Custom PC Build", price: "₱25,000" },
      { item: "Software Installation", price: "₱300" }
    ]
  },
  17: {
    id: "17",
    name: "FashionForward Boutique",
    category: "clothing",
    description: "Trendy clothing boutique featuring local and international fashion brands. Stylish apparel for men, women, and children.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80",
    rating: 4.4,
    ratingCount: 156,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80"
    ],
    location: "Magsaysay Avenue, Naga City",
    mapLocation: { latitude: 13.6210, longitude: 123.1955 },
    contact: "+63 (54) 478-2345",
    website: "www.fashionforward-naga.com",
    openingHours: "10:00 AM - 9:00 PM",
    priceRange: "₱300 - ₱2,000",
    menu: [
      { item: "Casual Wear", price: "₱500" },
      { item: "Formal Attire", price: "₱1,200" },
      { item: "Accessories", price: "₱200" }
    ]
  },
  18: {
    id: "18",
    name: "QuickBite Fast Food",
    category: "fastfood",
    description: "Popular fast food chain serving burgers, fried chicken, and Filipino favorites. Quick service and affordable prices.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80",
    rating: 4.2,
    ratingCount: 234,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80",
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80"
    ],
    location: "Triangulo, Naga City",
    mapLocation: { latitude: 13.6200, longitude: 123.1950 },
    contact: "+63 (54) 479-5678",
    website: "www.quickbite.ph",
    openingHours: "6:00 AM - 11:00 PM",
    priceRange: "₱80 - ₱250",
    menu: [
      { item: "Chicken Burger", price: "₱120" },
      { item: "Fried Chicken", price: "₱150" },
      { item: "Rice Meals", price: "₱95" }
    ]
  },
  19: {
    id: "19",
    name: "Wellness Dental Clinic",
    category: "dental",
    description: "Modern dental clinic offering comprehensive dental care including cleaning, fillings, extractions, and cosmetic dentistry.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80",
    rating: 4.7,
    ratingCount: 94,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80"
    ],
    location: "Panganiban Drive, Naga City",
    mapLocation: { latitude: 13.6190, longitude: 123.1960 },
    contact: "+63 (54) 470-1234",
    website: "www.wellnessdental-naga.com",
    openingHours: "8:00 AM - 6:00 PM",
    priceRange: "₱500 - ₱5,000",
    menu: [
      { item: "Dental Cleaning", price: "₱800" },
      { item: "Tooth Filling", price: "₱1,500" },
      { item: "Tooth Extraction", price: "₱2,000" }
    ]
  },
  20: {
    id: "20",
    name: "Metro Hardware Store",
    category: "hardware",
    description: "Complete hardware store with construction materials, tools, electrical supplies, and home improvement items.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80",
    rating: 4.3,
    ratingCount: 78,
    reviews: [],
    additionalImages: [
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80"
    ],
    location: "Dayangdang, Naga City",
    mapLocation: { latitude: 13.6230, longitude: 123.1940 },
    contact: "+63 (54) 471-9012",
    website: "www.metrohardware-naga.com",
    openingHours: "7:00 AM - 6:00 PM",
    priceRange: "₱50 - ₱10,000",
    menu: [
      { item: "Hand Tools", price: "₱200" },
      { item: "Paint & Brushes", price: "₱300" },
      { item: "Electrical Supplies", price: "₱150" }
    ]
  }
};

// Export for compatibility with existing code
export const ShopsData = Object.values(shopsData);

// Hierarchical categories with main categories and subcategories
export const mainCategories = [
  {
    id: "food-beverage",
    name: "Food & Beverage",
    icon: "restaurant",
    description: "Restaurants, cafes, bars, and food establishments",    subcategories: [
      { id: "dining", name: "Restaurants", icon: "restaurant-outline" },
      { id: "cafe", name: "Cafes", icon: "cafe-outline" },
      { id: "bars", name: "Bars & Nightlife", icon: "wine-outline" },
      { id: "fastfood", name: "Fast Food", icon: "fast-food-outline" },
      { id: "bakery", name: "Bakeries", icon: "storefront-outline" },
    ]
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    icon: "medical",
    description: "Spas, salons, pharmacies, and wellness services",    subcategories: [
      { id: "spa", name: "Spas & Wellness", icon: "leaf-outline" },
      { id: "salon", name: "Salons & Barbershops", icon: "cut-outline" },
      { id: "pharmacy", name: "Pharmacies", icon: "medical-outline" },
      { id: "clinic", name: "Clinics", icon: "medical" },
      { id: "dental", name: "Dental Services", icon: "medical-outline" },
      { id: "optical", name: "Optical Shops", icon: "eye-outline" },
    ]
  },
  {
    id: "technology-services",
    name: "Technology & Services",
    icon: "desktop",
    description: "Computer shops, printing, and tech services",    subcategories: [
      { id: "computer", name: "Computer Shops", icon: "desktop-outline" },
      { id: "mobile", name: "Mobile & Electronics", icon: "phone-portrait-outline" },
      { id: "printing", name: "Printing Services", icon: "print-outline" },
      { id: "internet", name: "Internet Cafes", icon: "wifi-outline" },
      { id: "repair", name: "Repair Services", icon: "build-outline" },
    ]
  },
  {
    id: "shopping-retail",
    name: "Shopping & Retail",
    icon: "storefront-outline",
    description: "Clothing, gifts, accessories, and retail stores",    subcategories: [
      { id: "souvenir", name: "Souvenirs & Gifts", icon: "gift-outline" },
      { id: "clothing", name: "Clothing & Fashion", icon: "shirt-outline" },
      { id: "shoes", name: "Shoes & Accessories", icon: "footsteps-outline" },
      { id: "jewelry", name: "Jewelry & Watches", icon: "diamond-outline" },
      { id: "books", name: "Books & Stationery", icon: "library-outline" },
      { id: "sports", name: "Sports & Recreation", icon: "fitness-outline" },
      { id: "toys", name: "Toys & Games", icon: "game-controller-outline" },
    ]
  },
  {
    id: "professional-services",
    name: "Professional Services",
    icon: "briefcase",
    description: "Financial, legal, and business services",    subcategories: [
      { id: "financial", name: "Financial Services", icon: "card-outline" },
      { id: "insurance", name: "Insurance", icon: "shield-outline" },
      { id: "legal", name: "Legal Services", icon: "document-text-outline" },
      { id: "accounting", name: "Accounting", icon: "calculator-outline" },
      { id: "realestate", name: "Real Estate", icon: "home-outline" },
      { id: "travel", name: "Travel & Tours", icon: "airplane-outline" },
    ]
  },
  {
    id: "automotive-transportation",
    name: "Automotive & Transportation",
    icon: "car-outline",
    description: "Car services, gas stations, and transportation",
    subcategories: [
      { id: "automotive", name: "Automotive Services", icon: "car" },
      { id: "gasstation", name: "Gas Stations", icon: "car-sport" },
      { id: "parking", name: "Parking Services", icon: "car-outline" },
    ]
  },
  {
    id: "specialty-stores",
    name: "Specialty Stores",
    icon: "hammer",
    description: "Hardware, garden, pet, and specialty shops",
    subcategories: [
      { id: "hardware", name: "Hardware Stores", icon: "hammer" },
      { id: "garden", name: "Garden & Plants", icon: "flower" },
      { id: "pet", name: "Pet Stores & Services", icon: "paw" },
      { id: "music", name: "Music & Instruments", icon: "musical-notes" },
      { id: "art", name: "Art & Crafts", icon: "brush" },
    ]
  },
  {
    id: "essential-services",
    name: "Essential Services",
    icon: "basket",
    description: "Grocery, laundry, and daily necessities",
    subcategories: [
      { id: "laundry", name: "Laundry Services", icon: "shirt-outline" },
      { id: "grocery", name: "Grocery Stores", icon: "basket" },
      { id: "convenience", name: "Convenience Stores", icon: "storefront" },
      { id: "market", name: "Markets", icon: "basket-outline" },
    ]
  }
];

// Flattened categories for backward compatibility
export const categories = mainCategories.flatMap(mainCat => 
  mainCat.subcategories.map(subCat => ({
    ...subCat,
    mainCategory: mainCat.id,
    mainCategoryName: mainCat.name
  }))
);

// Helper functions for category management
export const getCategoryById = (categoryId) => {
  return categories.find(cat => cat.id === categoryId);
};

export const getMainCategoryById = (mainCategoryId) => {
  return mainCategories.find(cat => cat.id === mainCategoryId);
};

export const getSubcategoriesByMainCategory = (mainCategoryId) => {
  const mainCat = getMainCategoryById(mainCategoryId);
  return mainCat ? mainCat.subcategories : [];
};

export const getMainCategoryBySubcategory = (subcategoryId) => {
  const category = getCategoryById(subcategoryId);
  return category ? getMainCategoryById(category.mainCategory) : null;
};

// Featured locations (first 3 shops)
export const featuredShops = [
  shopsData["1"],
  shopsData["2"],
  shopsData["3"],
];

// Destinations mapping for consistency with tourist spots
export const destinations = Object.values(shopsData);
