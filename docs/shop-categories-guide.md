# Shop Categories Guide

This document provides a comprehensive overview of all business categories available in the Naga Venture app's shop directory. The shop module is designed to accommodate all types of registered businesses and services in Naga City, excluding accommodations (hotels/resorts) and tourist spots which have their dedicated directories.

## Category Overview

The shop directory includes **42 comprehensive categories** covering various business types and services:

### Food & Beverage (5 categories)
- **Restaurants** (`dining`) - Full-service restaurants and dining establishments
- **Cafes** (`cafe`) - Coffee shops, cafes, and casual dining
- **Bars & Nightlife** (`bars`) - Bars, pubs, and nightlife venues
- **Fast Food** (`fastfood`) - Quick service restaurants and fast food chains
- **Bakeries** (`bakery`) - Bakeries, pastry shops, and dessert places

### Health & Beauty Services (6 categories)
- **Spas & Wellness** (`spa`) - Spa services, massage therapy, wellness centers
- **Salons & Barbershops** (`salon`) - Hair salons, barbershops, beauty services
- **Pharmacies** (`pharmacy`) - Drugstores, pharmacies, medical supplies
- **Clinics** (`clinic`) - Medical clinics, healthcare facilities
- **Dental Services** (`dental`) - Dental clinics, orthodontists
- **Optical Shops** (`optical`) - Eyewear stores, optometry services

### Technology & Services (5 categories)
- **Computer Shops** (`computer`) - Computer sales, IT services, repairs
- **Mobile & Electronics** (`mobile`) - Mobile phones, electronics, gadgets
- **Printing Services** (`printing`) - Printing, copy services, document services
- **Internet Cafes** (`internet`) - Internet cafes, gaming centers
- **Repair Services** (`repair`) - General repair services, maintenance

### Shopping & Retail (7 categories)
- **Souvenirs & Gifts** (`souvenir`) - Gift shops, souvenir stores, pasalubong
- **Clothing & Fashion** (`clothing`) - Clothing stores, fashion boutiques
- **Shoes & Accessories** (`shoes`) - Footwear, bags, accessories
- **Jewelry & Watches** (`jewelry`) - Jewelry stores, watch shops
- **Books & Stationery** (`books`) - Bookstores, office supplies, stationery
- **Sports & Recreation** (`sports`) - Sports equipment, fitness gear
- **Toys & Games** (`toys`) - Toy stores, gaming equipment

### Professional Services (6 categories)
- **Financial Services** (`financial`) - Banks, money changers, financial services
- **Insurance** (`insurance`) - Insurance companies, agents
- **Legal Services** (`legal`) - Law offices, legal consultations
- **Accounting** (`accounting`) - Accounting services, tax preparation
- **Real Estate** (`realestate`) - Real estate agencies, property services
- **Travel & Tours** (`travel`) - Travel agencies, tour operators

### Automotive & Transportation (3 categories)
- **Automotive Services** (`automotive`) - Car repair, maintenance, parts
- **Gas Stations** (`gasstation`) - Fuel stations, car services
- **Parking Services** (`parking`) - Parking facilities, valet services

### Specialty Stores (5 categories)
- **Hardware Stores** (`hardware`) - Construction supplies, tools, hardware
- **Garden & Plants** (`garden`) - Plant nurseries, gardening supplies
- **Pet Stores & Services** (`pet`) - Pet shops, veterinary services, grooming
- **Music & Instruments** (`music`) - Musical instruments, music stores
- **Art & Crafts** (`art`) - Art supplies, craft stores, creative materials

### Essential Services (4 categories)
- **Laundry Services** (`laundry`) - Laundromats, dry cleaning, washing services
- **Grocery Stores** (`grocery`) - Supermarkets, grocery stores
- **Convenience Stores** (`convenience`) - 24/7 stores, quick shopping
- **Markets & Bazaars** (`market`) - Traditional markets, weekend bazaars

## Technical Implementation

### Category Structure
Each category includes:
- **ID**: Unique identifier for routing and filtering
- **Name**: Display name for the category
- **Icon**: Ionicon name for visual representation

### Features Available
- **Search Functionality**: Search within each category
- **Filtering**: Filter shops by category, rating, price range
- **Sorting**: Sort by name, rating, distance
- **Navigation**: Direct routing to category pages
- **Details**: Comprehensive shop information including:
  - Contact information
  - Opening hours
  - Price ranges
  - Service menus
  - Location mapping
  - Reviews and ratings

### Responsive Design
- Grid layout for category browsing
- List view for detailed information
- Mobile-optimized interface
- Dark/light theme support

## Usage Examples

### Accessing Categories
```typescript
// Navigate to specific category
router.push('/(tabs)/(home)/(shops)/(categories)/spa');
router.push('/(tabs)/(home)/(shops)/(categories)/computer');
router.push('/(tabs)/(home)/(shops)/(categories)/printing');
```

### Category Filtering
```typescript
// Filter shops by category
const spaShops = filterShops(allShops, { category: 'spa' });
const computerShops = filterShops(allShops, { category: 'computer' });
```

## Benefits for Local Business Discovery

1. **Comprehensive Coverage**: All types of businesses are represented
2. **Easy Navigation**: Intuitive category-based browsing
3. **Local Focus**: Specifically designed for Naga City businesses
4. **Service Discovery**: Helps users find specific services they need
5. **Business Promotion**: Platform for local businesses to showcase services
6. **Tourist Assistance**: Helps visitors find essential services
7. **Local Economy Support**: Promotes local business discovery

## Sample Businesses by Category

### Spa & Wellness
- Serenity Spa & Wellness - Full-service spa with massage and treatments

### Computer Shops
- TechHub Computer Shop - Computer sales, repairs, and custom builds

### Printing Services
- QuickPrint Services - Professional printing and copy services

### Salon Services
- StyleCut Hair Salon - Professional hair styling and treatments

### Garden Centers
- GreenThumb Garden Center - Plants, gardening tools, and supplies

### Pet Services
- PetLove Animal Clinic & Shop - Veterinary services and pet supplies

### Automotive
- AutoCare Service Center - Complete automotive maintenance

### Pharmacy
- NagaMed Pharmacy - 24-hour medical supplies and consultation

### Laundry Services
- Fresh Clean Laundry - Professional laundry and dry cleaning

## Future Enhancements

1. **Business Registration**: Allow businesses to register and manage their listings
2. **Advanced Filtering**: More granular filtering options
3. **Reviews System**: Enhanced customer review and rating system
4. **Booking Integration**: Appointment booking for service-based businesses
5. **Delivery Services**: Integration with local delivery services
6. **Promotions**: Special offers and promotional campaigns
7. **Analytics**: Business insights and customer analytics

This comprehensive category system ensures that all types of businesses in Naga City have appropriate representation in the app, making it a complete local business directory and discovery platform.
