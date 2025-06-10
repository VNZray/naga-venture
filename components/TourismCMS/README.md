# TourismCMS Components

This directory contains Tourism CMS-specific components organized using Atomic Design principles following KISS, DRY, and SOLID principles.

## Structure

```
components/TourismCMS/
├── atoms/           # Basic building blocks
├── molecules/       # Combinations of atoms
├── organisms/       # Complex components with multiple molecules/atoms
└── index.ts         # Main export file
```

## Atoms (Basic Components)

### CMSButton
- **File**: `atoms/CMSButton.tsx`
- **Purpose**: Standardized button component for TourismCMS
- **Features**:
  - Multiple variants (primary, secondary, tertiary, danger)
  - Size options (small, medium, large)
  - Loading states
  - Icon support
  - Full width option
  - Disabled states

### CMSText
- **File**: `atoms/CMSText.tsx`
- **Purpose**: Typography component for consistent text styling
- **Features**:
  - Multiple text types (title, subtitle, body, caption, label)
  - Theme-aware colors
  - Light/dark mode support

### CMSInput
- **File**: `atoms/CMSInput.tsx`
- **Purpose**: Standardized input component for forms
- **Features**:
  - Label and error display
  - Required field indicators
  - Hint text support
  - Consistent styling
  - Accessibility features

## Molecules (Component Combinations)

### CMSHeader
- **File**: `molecules/CMSHeader.tsx`
- **Purpose**: Header component for admin interface
- **Features**:
  - User information display
  - Notification icon
  - Dynamic title
  - User profile actions

### CMSStatCard
- **File**: `molecules/CMSStatCard.tsx`
- **Purpose**: Statistics display card for dashboards
- **Features**:
  - Title, value, and subtitle display
  - Customizable colors
  - Consistent card styling
  - Shadow effects

## Organisms (Complex Components)

### CMSRouteGuard
- **File**: `organisms/CMSRouteGuard.tsx`
- **Purpose**: Route protection for TourismCMS pages
- **Features**:
  - Authentication checking
  - Role-based authorization
  - Loading states
  - Error handling with user-friendly messages
  - Navigation fallbacks

### CMSDashboardLayout
- **File**: `organisms/CMSDashboardLayout.tsx`
- **Purpose**: Standardized layout for dashboard pages
- **Features**:
  - Consistent header structure
  - Statistics section
  - Content area
  - Action button placement
  - Responsive design

## Usage

### Import Components
```typescript
// Import individual components
import { CMSButton, CMSText, CMSHeader, CMSRouteGuard } from '@/components/TourismCMS';

// Or import from specific levels
import { CMSButton } from '@/components/TourismCMS/atoms';
import { CMSHeader } from '@/components/TourismCMS/molecules';
```

### Example Usage

#### CMSButton
```tsx
<CMSButton
  title="Save Changes"
  variant="primary"
  size="large"
  onPress={handleSave}
  loading={isLoading}
  fullWidth
/>
```

#### CMSText
```tsx
<CMSText type="title" darkColor="#000">
  Dashboard Title
</CMSText>
```

#### CMSHeader
```tsx
<CMSHeader
  title="Tourism CMS"
  userName="John Doe"
  userEmail="john@example.com"
  onNotificationPress={handleNotifications}
  onUserPress={handleUserMenu}
/>
```

#### CMSInput
```tsx
<CMSInput
  label="Business Name"
  placeholder="Enter business name"
  required
  error={errors.businessName}
  hint="This will be displayed publicly"
  value={businessName}
  onChangeText={setBusinessName}
/>
```

#### CMSStatCard
```tsx
<CMSStatCard
  title="Total Bookings"
  value="1,234"
  subtitle="This month"
  color="#34C759"
/>
```

#### CMSRouteGuard
```tsx
<CMSRouteGuard routePath="/TourismCMS/(admin)/dashboard">
  <YourProtectedContent />
</CMSRouteGuard>
```

#### CMSDashboardLayout
```tsx
<CMSDashboardLayout
  title="Analytics Dashboard"
  subtitle="View comprehensive business metrics"
  stats={analyticsStats}
  actions={<CMSButton title="Export" onPress={handleExport} />}
>
  <YourDashboardContent />
</CMSDashboardLayout>
```

## Design Principles Applied

### KISS (Keep It Simple, Stupid)
- Each component has a single, clear responsibility
- Simple, intuitive APIs
- Minimal configuration required

### DRY (Don't Repeat Yourself)
- Shared styling through design tokens
- Reusable component patterns
- Common functionality abstracted

### SOLID Principles
- **Single Responsibility**: Each component handles one concern
- **Open/Closed**: Components extensible through props
- **Liskov Substitution**: Components can be safely replaced
- **Interface Segregation**: Minimal, focused prop interfaces
- **Dependency Inversion**: Components depend on abstractions

### Atomic Design
- **Atoms**: Basic UI elements (buttons, text)
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complex components with business logic
- **Templates/Pages**: Layout and page-level components

## Migration Notes

The following components have been migrated from generic components to TourismCMS-specific ones:

- `PressableButton` → `CMSButton`
- `ThemedText` → `CMSText`
- `AdminHeader` → `CMSHeader`
- `RouteGuard` → `CMSRouteGuard` (for TourismCMS-specific usage)
- Added new components: `CMSInput`, `CMSStatCard`, `CMSDashboardLayout`

### Files Updated:
- ✅ `app/TourismCMS/login.tsx`
- ✅ `app/TourismCMS/register.tsx`
- ✅ `app/TourismCMS/(admin)/_layout.tsx`
- ✅ `app/TourismCMS/(admin)/dashboard.tsx`
- ✅ `app/TourismCMS/(admin)/user-management.tsx`
- ✅ `app/TourismCMS/(admin)/analytics.tsx`
- ✅ `app/TourismCMS/(admin)/business-listings.tsx`
- ✅ All remaining admin files via batch update

## Benefits

1. **Consistency**: Unified design language across TourismCMS
2. **Maintainability**: Centralized component logic
3. **Reusability**: Components designed for multiple use cases
4. **Type Safety**: Full TypeScript support
5. **Performance**: Optimized with React.memo where appropriate
6. **Accessibility**: Built-in accessibility features
