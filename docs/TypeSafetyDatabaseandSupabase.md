# TypeScript Database Types Usage Guide

## Overview
Your Naga Venture project now has comprehensive TypeScript types generated from your Supabase database schema. This guide explains how to use them effectively.

## Generated Files

### 1. `types/database.ts` (Generated)
- **Source**: Auto-generated from Supabase schema
- **Content**: Complete database schema types
- **Usage**: Raw database types (don't edit manually)

### 2. `types/supabase.ts` (Helper)
- **Source**: Manually created convenience layer
- **Content**: Type aliases, utility types, and constants
- **Usage**: Convenient developer-friendly types

## Type Usage Examples

### User Profiles
```typescript
import { UserProfile, UserRole } from '../types/supabase';

// Type-safe user profile
const user: UserProfile = {
  id: 'uuid',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'tourism_admin', // ✅ Type-safe enum
  is_verified: true,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
  phone_number: null,
  profile_image_url: null
};

// Role checking
function canManageUsers(role: UserRole): boolean {
  return role === 'tourism_admin';
}
```

### Business Operations
```typescript
import { Business, BusinessStatus, BusinessType } from '../types/supabase';

// Type-safe business creation
const newBusiness: BusinessInsert = {
  business_name: 'Example Hotel',
  business_type: 'accommodation', // ✅ Type-safe enum
  description: 'A great hotel',
  address: '123 Main St',
  location: point, // PostGIS point
  // Other required fields...
};

// Type-safe queries
const { data: businesses } = await supabase
  .from('businesses')
  .select('*')
  .eq('status', 'approved') // ✅ Type-safe status
  .returns<Business[]>(); // ✅ Explicit return type
```

### Review Management
```typescript
import { Review, ReviewType } from '../types/supabase';

// Type-safe review filtering
function filterReviewsByType(reviews: Review[], type: ReviewType): Review[] {
  return reviews.filter(review => review.review_type === type);
}

// Business reviews only
const businessReviews = filterReviewsByType(allReviews, 'business');
```

## Role-Based Access Control

### Using Predefined Role Types
```typescript
import { AdminRoles, StaffRoles, ContentManagerRoles } from '../types/supabase';

function isAdmin(role: UserRole): role is AdminRoles {
  return role === 'tourism_admin';
}

function isStaff(role: UserRole): role is StaffRoles {
  return ['tourism_admin', 'business_listing_manager', 'tourism_content_manager', 'business_registration_manager'].includes(role);
}

function canManageContent(role: UserRole): role is ContentManagerRoles {
  return ['tourism_admin', 'tourism_content_manager'].includes(role);
}
```

### Permission Checking
```typescript
import { ROLE_PERMISSIONS, Permission } from '../types/supabase';

function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

// Usage
if (hasPermission(user.role, 'manage_businesses')) {
  // Show business management UI
}
```

## Supabase Query Patterns

### Type-Safe Queries
```typescript
import { SupabaseQuery } from '../types/supabase';

// Strongly typed query results
async function getBusinessById(id: string): Promise<Business | null> {
  const { data, error }: SupabaseQuery<Business> = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
```

### Complex Queries with Relations
```typescript
import { BusinessWithImages, BusinessWithReviews } from '../types/supabase';

// Business with related data
const { data: businessWithImages } = await supabase
  .from('businesses')
  .select(`
    *,
    business_images(*)
  `)
  .eq('id', businessId)
  .single()
  .returns<BusinessWithImages>();
```

## Auth Context Integration

Your `AuthContext` now uses the generated types:

```typescript
// In AuthContext.tsx
import { UserRole, Profile as UserProfile } from '../types/supabase';

// Type-safe context
interface AuthContextType {
  userProfile: UserProfile | null;
  hasRole: (role: UserRole) => boolean;
  // ...
}
```

## Best Practices

### 1. Always Use Generated Types
```typescript
// ✅ Good - Use generated types
const user: UserProfile = userData;

// ❌ Avoid - Manual interfaces
interface User { // Don't create manual interfaces
  id: string;
  email: string;
  // ...
}
```

### 2. Type Guards for Safety
```typescript
function isValidBusinessType(type: string): type is BusinessType {
  return ['accommodation', 'shop', 'service'].includes(type);
}

// Safe type casting
if (isValidBusinessType(userInput)) {
  // Now userInput is typed as BusinessType
  createBusiness({ business_type: userInput });
}
```

### 3. Utility Types for Flexibility
```typescript
// Pick specific fields
type BusinessSummary = Pick<Business, 'id' | 'business_name' | 'business_type'>;

// Make fields optional for updates
type BusinessUpdatePayload = Partial<BusinessUpdate>;
```

## Regenerating Types

When your database schema changes:

1. **Supabase CLI**: 
   ```bash
   supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
   ```

2. **Supabase Dashboard**: Use the "Generate Types" feature

3. **Update `supabase.ts`**: Add new type aliases as needed

## Migration Guide

If you have existing code using manual types:

1. **Replace imports**:
   ```typescript
   // Old
   import { UserRole } from './manual-types';
   
   // New
   import { UserRole } from '../types/supabase';
   ```

2. **Update interfaces**:
   ```typescript
   // Old
   interface User {
     id: string;
     email: string;
     role: 'admin' | 'user';
   }
   
   // New
   import { UserProfile } from '../types/supabase';
   // UserProfile is now your complete user type
   ```

3. **Check enums**:
   ```typescript
   // Old
   const role = 'admin';
   
   // New
   const role: UserRole = 'tourism_admin'; // Use exact enum values
   ```

This type system ensures your entire application stays in sync with your database schema and provides excellent developer experience with full IntelliSense support!
