# Shops Module File Structure Documentation

## Overview
This document provides a comprehensive overview of the Shops module file structure, including what files are being used and their purposes.

## File Structure

### 📁 App Pages (`app/(tabs)/(home)/(shops)/`)
```
(shops)/
├── index.jsx                    ✅ ACTIVE - Main shops directory/homepage
├── FeaturedShops.tsx           ✅ ACTIVE - Featured shops listing page
├── SpecialOffers.tsx           ✅ ACTIVE - Special offers listing page  
├── RecommendedShops.tsx        ✅ ACTIVE - Recommended shops listing page
├── (details)/
│   └── [shopId].jsx            ✅ ACTIVE - Individual shop detail page (using composition)
└── (categories)/
    └── [category].jsx          ✅ ACTIVE - Category-specific shop listing (using composition)
```

### 📁 Shop Components (`components/shops/`)
```
shops/
├── index.ts                    ✅ ACTIVE - Component exports
├── types.ts                    ✅ ACTIVE - TypeScript interfaces for shop components
├── ShopCard.tsx               ✅ ACTIVE - Reusable shop card component
├── ShopList.tsx               ✅ ACTIVE - Reusable shop list component
├── ShopCarousel.tsx           ✅ ACTIVE - Horizontal scrolling shop carousel
├── ShopCategories.tsx         ✅ ACTIVE - Category selection component
├── ShopSearch.tsx             ✅ ACTIVE - Search functionality component
├── ShopDirectory.tsx          ✅ ACTIVE - Directory listing component
├── ShopDetail.tsx             ✅ ACTIVE - Shop detail view component
├── ShopCategoryPage.tsx       ✅ ACTIVE - Category page component
├── FeaturedShopCard.tsx       ✅ ACTIVE - Featured shop card variant
├── RecommendedShopCard.tsx    ✅ ACTIVE - Recommended shop card variant
├── SpecialOfferCard.tsx       ✅ ACTIVE - Special offer card variant
├── DiscoverMoreShopCard.tsx   ✅ ACTIVE - Discovery card component
└── DiscoverMoreShopList.tsx   ✅ ACTIVE - Discovery list component
```

### 📁 Data & Types
```
Controller/
└── ShopData.js                ✅ ACTIVE - Shop data and mock data

types/
└── shop.ts                    ✅ ACTIVE - Core shop type definitions

constants/
└── ShopColors.ts              ✅ ACTIVE - Shop-specific color constants
```

### 📁 Utils
```
utils/
└── shopUtils.ts               ❌ UNUSED - Shop utility functions (not imported anywhere)
```

## Component Usage Matrix

### ShopCard Usage
- ✅ `FeaturedShops.tsx` - Grid layout with rating and category
- ✅ `SpecialOffers.tsx` - List layout with ratings
- ✅ `RecommendedShops.tsx` - Basic card display
- ✅ `ShopList.tsx` - Reusable list component

### Layout Components Usage
- ✅ `ShopDirectoryLayout.tsx` - Used in main index and category pages
- ✅ `ShopDetailLayout.tsx` - Used in shop detail pages
- ✅ `ShopTabContainer.tsx` - Used in shop detail tabs
- ✅ `ShopItemList.tsx` - Used in directory and category displays

### Composition Pattern Implementation
- ✅ **Directory Page** (`index.jsx`) - Uses `ShopDirectoryLayout` + `ShopFeaturedCarousel` + `ShopCategoriesSection` + `ShopItemList`
- ✅ **Detail Page** (`[shopId].jsx`) - Uses `ShopDetailLayout` + `ShopTabContainer` + tab content components
- ✅ **Category Page** (`[category].jsx`) - Uses `ShopDirectoryLayout` + `ShopItemList`

## Key Features

### ✅ Implemented Features
- **Search & Filter**: Search functionality across all shop listings
- **Category Navigation**: Browse shops by category (bars, cafes, dining, souvenirs)
- **Featured Shops**: Curated list of featured establishments
- **Special Offers**: Promotional content display
- **Recommendations**: Algorithm-based shop suggestions
- **Shop Details**: Comprehensive shop information with tabs (Details, Reviews, Photos)
- **Responsive Design**: Grid and list layouts optimized for mobile
- **Composition Architecture**: Reusable, modular component structure

### 🔧 Architecture Patterns
- **Composition Pattern**: Implemented across all major shop pages
- **Prop Drilling Prevention**: Clean component interfaces with focused responsibilities
- **Reusable Components**: Shared components for cards, lists, and layouts
- **Type Safety**: Comprehensive TypeScript interfaces for all components

## Notes
- All shop-related pages successfully use the composition pattern
- Original files have been replaced with composed versions
- Backup files (`*_original.jsx`) exist for rollback if needed
- `shopUtils.ts` exists but is currently unused - can be removed or integrated as needed
- The module follows a clean separation between data, presentation, and layout components