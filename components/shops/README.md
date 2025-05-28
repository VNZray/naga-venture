# Shop-Specific Composition Components

This directory contains composition components specifically designed for the Shops module. These components demonstrate the composition pattern using the children prop and are tailored for shop-specific functionality.

## Architecture

The shop composition components follow a specific structure:

```
components/shops/
├── index.ts                           # Export all shop components
└── layouts/
    ├── ShopDirectoryLayout.tsx        # Main shop directory layout
    ├── ShopFeaturedCarousel.tsx       # Featured shops carousel
    ├── ShopCategoriesSection.tsx      # Shop categories display
    ├── ShopItemList.tsx              # Shop items grid/list
    └── ShopDetailLayout.tsx          # Individual shop detail layout
```

## Components Overview

### ShopDirectoryLayout
- **Purpose**: Main layout for shop directory pages
- **Composition**: Accepts children for main content area
- **Features**: Search bar, featured section, scrollable content
- **Usage**: Wraps the entire shop directory page

### ShopFeaturedCarousel
- **Purpose**: Displays featured shops in a carousel
- **Composition**: Self-contained with configurable data
- **Features**: Auto-play, parallax scrolling, shop-specific display
- **Usage**: Passed as content to ShopDirectoryLayout

### ShopCategoriesSection
- **Purpose**: Displays shop categories in a grid
- **Composition**: Uses existing CardContainer and PressableButton
- **Features**: Category navigation, responsive grid
- **Usage**: Rendered as children in ShopDirectoryLayout

### ShopItemList
- **Purpose**: Displays shops in a responsive grid
- **Composition**: Configurable display options
- **Features**: Rating, category badges, open status, price display
- **Usage**: Main content component for shop listings

### ShopDetailLayout
- **Purpose**: Layout for individual shop detail pages
- **Composition**: Hero section + action buttons + children content
- **Features**: Hero image, action buttons (call, website, directions)
- **Usage**: Wraps shop detail page content

## Benefits of This Approach

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be combined in different ways
3. **Maintainability**: Shop-specific logic is contained
4. **Flexibility**: Easy to modify shop features without affecting other modules
5. **Team Independence**: Shops module can evolve independently

## Usage Example

```jsx
// Shop Directory Page
import { 
  ShopDirectoryLayout,
  ShopFeaturedCarousel,
  ShopCategoriesSection,
  ShopItemList 
} from "@/components/shops";

const ShopsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const featuredContent = (
    <ShopFeaturedCarousel
      data={featuredShops}
      onItemPress={handleShopPress}
    />
  );

  return (
    <ShopDirectoryLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      featuredContent={featuredContent}
    >
      <ShopCategoriesSection
        categories={shopCategories}
        onCategoryPress={handleCategoryPress}
      />
      
      <ShopItemList
        shops={filteredShops}
        onShopPress={handleShopPress}
        showRating={true}
        showOpenStatus={true}
      />
    </ShopDirectoryLayout>
  );
};
```

## Implementation Status

✅ **Completed:**
- ShopDirectoryLayout with search and featured sections
- ShopFeaturedCarousel with shop-specific features
- ShopCategoriesSection with shop category navigation
- ShopItemList with shop-specific display options
- ShopDetailLayout for individual shop pages
- ShopTabContainer for shop detail tabs
- Updated main shop index.jsx to use composition (200+ lines → ~80 lines)
- Updated shop detail [shopId].jsx to use composition (547+ lines → ~220 lines)
- Updated shop category [category].jsx to use composition (278+ lines → ~60 lines)

📊 **Results Achieved:**
- **Shop Directory**: ~60% code reduction
- **Shop Detail**: ~60% code reduction  
- **Shop Category**: ~78% code reduction
- **Total Impact**: Significant improvement in maintainability and reusability

✅ **Team Boundaries Respected:**
- Composition isolated to shops module only
- No impact on Tourist Spots, Events, or Accommodations
- Other modules remain unchanged and unaffected

📋 **Future Enhancements:**
- Shop-specific filtering components
- Shop comparison components
- Shop review components
- Shop booking/reservation components

## Files Modified

- `app/(tabs)/(home)/(shops)/index.jsx` - Updated to use shop-specific components
- `components/shops/` - New directory with all shop composition components

## Team Notes

This implementation is **shop-specific only** and does not affect other modules (Tourist Spots, Accommodations, Events). The composition pattern is isolated to the shops module to allow for independent development and testing.
