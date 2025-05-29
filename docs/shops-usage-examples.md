# Shops Module Usage Examples

This document provides examples of how to use the newly type-safe shops module following SOLID principles.

## Basic Component Usage

```tsx
import React from 'react';
import { useShopContext, useShopFilters } from '@/context/ShopContext';
import { ShopItemList } from '@/components/shops';
import type { ShopData } from '@/types/shop';

const MyShopsComponent: React.FC = () => {
  // Type-safe context usage
  const { shops } = useShopContext();
  const { searchQuery, setSearchQuery, getFilteredShops } = useShopFilters();
  
  // Type-safe event handlers
  const handleShopPress = (shopId: string) => {
    console.log('Shop pressed:', shopId);
  };
  
  // Type-safe filtered data
  const filteredShops: ShopData[] = getFilteredShops();
  
  return (
    <ShopItemList
      shops={filteredShops}
      onShopPress={handleShopPress}
      title="My Shops"
      showRating={true}
      showCategory={true}
    />
  );
};
```

## Using Utility Functions

```tsx
import { 
  filterShops, 
  sortShops, 
  validateShopData,
  getShopStatistics,
  transformToFeaturedShop 
} from '@/utils/shopUtils';
import type { ShopData, ShopFilterCriteria } from '@/types/shop';

const ExampleUsage: React.FC = () => {
  // Sample shop data (would come from API/context)
  const shops: ShopData[] = []; // Your shop data here
  
  // Type-safe filtering
  const filterCriteria: ShopFilterCriteria = {
    category: 'dining',
    minRating: 4.0,
    searchQuery: 'burger'
  };
  
  const filteredShops = filterShops(shops, filterCriteria);
  
  // Type-safe sorting
  const sortedShops = sortShops(filteredShops, 'rating', 'desc');
  
  // Type-safe validation
  const newShop: Partial<ShopData> = {
    id: '123',
    name: 'New Restaurant',
    category: 'dining',
    // ... other properties
  };
  
  const validation = validateShopData(newShop);
  if (!validation.isValid) {
    console.error('Validation errors:', validation.errors);
  }
  
  // Type-safe statistics
  const stats = getShopStatistics(shops);
  console.log(`Total shops: ${stats.totalShops}`);
  console.log(`Average rating: ${stats.averageRating}`);
  
  // Type-safe transformation
  const featuredShops = shops
    .slice(0, 3)
    .map(transformToFeaturedShop);
  
  return <div>Example component</div>;
};
```

## Context Provider Setup

```tsx
// App.tsx or _layout.tsx
import React from 'react';
import { ShopProvider } from '@/context/ShopContext';

const App: React.FC = () => {
  return (
    <ShopProvider>
      {/* Your app components */}
    </ShopProvider>
  );
};
```

## Custom Hook Usage

```tsx
import { useShopData, useShopFilters, useShopFavorites } from '@/context/ShopContext';

const ShopDetailsPage: React.FC<{ shopId: string }> = ({ shopId }) => {
  // Get specific shop data
  const { getShopById } = useShopData();
  const shop = getShopById(shopId);
  
  // Handle favorites
  const { favoriteShops, toggleFavorite } = useShopFavorites();
  const isFavorite = favoriteShops.includes(shopId);
  
  if (!shop) {
    return <div>Shop not found</div>;
  }
  
  return (
    <div>
      <h1>{shop.name}</h1>
      <button onClick={() => toggleFavorite(shopId)}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      {/* Rest of component */}
    </div>
  );
};
```

## Type Guards Usage

```tsx
import { isValidShopData, isValidShopCategory } from '@/utils/shopUtils';

const DataProcessor: React.FC = () => {
  const processApiData = (data: unknown) => {
    if (isValidShopData(data)) {
      // TypeScript now knows data is ShopData
      console.log('Valid shop:', data.name);
      return data;
    } else {
      console.error('Invalid shop data received');
      return null;
    }
  };
  
  const processCategoryData = (data: unknown) => {
    if (isValidShopCategory(data)) {
      // TypeScript now knows data is ShopCategory
      console.log('Valid category:', data.name);
      return data;
    } else {
      console.error('Invalid category data received');
      return null;
    }
  };
  
  return <div>Data processor component</div>;
};
```

## Error Handling

```tsx
import { ValidationResult } from '@/utils/shopUtils';

const FormComponent: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  
  const handleSubmit = (formData: Partial<ShopData>) => {
    const validation: ValidationResult = validateShopData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Proceed with valid data
    setErrors([]);
    // Submit to API
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
};
```

## Best Practices

1. **Always use type imports**: `import type { ShopData } from '@/types/shop'`
2. **Use context hooks**: Prefer `useShopFilters()` over direct context access
3. **Validate external data**: Use type guards for API responses
4. **Handle errors gracefully**: Check validation results before processing
5. **Leverage utility functions**: Don't reinvent filtering/sorting logic
6. **Keep components focused**: Use selective hooks for specific functionality
7. **Type your event handlers**: Always specify parameter types explicitly

## Migration from Old Code

```tsx
// OLD: Implicit types and local interfaces
const handleShopPress = (shopId) => { // ❌ Implicit any
  router.push(`/shops/${shopId}`);
};

interface LocalShop { // ❌ Duplicate interface
  id: number; // ❌ Inconsistent ID type
  name: string;
}

// NEW: Explicit types and centralized interfaces
const handleShopPress = (shopId: string) => { // ✅ Explicit string type
  router.push(`/shops/${shopId}`);
};

// ✅ Use centralized ShopData type
import type { ShopData } from '@/types/shop';
```
