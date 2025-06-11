# Proposed File Structure for TourismCMS Admin

This document outlines the proposed changes to the file structure within `app/TourismCMS/(admin)/` to improve navigability and reduce nesting.

The primary change is to move `index.tsx` files from subdirectories into their parent directory, renaming them to match the original subdirectory's name.

## Example Transformation:

**Old Structure:**

```
app/
└── TourismCMS/
    └── (admin)/
        └── category/
            └── sub-category/
                └── index.tsx
```

**New Structure:**

```
app/
└── TourismCMS/
    └── (admin)/
        └── category/
            └── sub-category.tsx
```

## Detailed Proposed Structure:

### `app/TourismCMS/(admin)/analytics-reporting/`

**Current (example):**
```
app/TourismCMS/(admin)/analytics-reporting/
├── business-analytics-detail/
│   └── index.tsx
├── platform-analytics/
│   └── index.tsx
├── registration-analytics/
│   └── index.tsx
└── tourism-analytics/
    └── index.tsx
```

**Proposed:**
```
app/TourismCMS/(admin)/analytics-reporting/
├── business-analytics-detail.tsx
├── platform-analytics.tsx
├── registration-analytics.tsx
└── tourism-analytics.tsx
```

### `app/TourismCMS/(admin)/bookings-finance/`

**Current (example):**
```
app/TourismCMS/(admin)/bookings-finance/
├── booking-management/
│   └── index.tsx
└── financial-overview/
    └── index.tsx
```

**Proposed:**
```
app/TourismCMS/(admin)/bookings-finance/
├── booking-management.tsx
└── financial-overview.tsx
```

### `app/TourismCMS/(admin)/business-management/`

**Current (example):**
```
app/TourismCMS/(admin)/business-management/
├── business-analytics/
│   └── index.tsx
└── business-listings/
    ├── accommodations/
    │   └── index.tsx
    ├── all-businesses/
    │   └── index.tsx
    ├── create/
    │   └── index.tsx
    ├── edit/
    │   └── [id]/
    │       └── index.tsx
    ├── featured-businesses/
    │   └── index.tsx
    └── shops-services/
        └── index.tsx
```

**Proposed:**
```
app/TourismCMS/(admin)/business-management/
├── business-analytics.tsx
└── business-listings/
    ├── accommodations.tsx
    ├── all-businesses.tsx
    ├── create.tsx
    ├── edit/
    │   └── [id].tsx  // Assuming dynamic route file is also an index.tsx equivalent
    ├── featured-businesses.tsx
    └── shops-services.tsx
```

**Note on Dynamic Routes:** For dynamic routes like `edit/[id]/index.tsx`, the proposal is to change it to `edit/[id].tsx`. If the `[id]` segment itself is a screen, this would be the Expo Router convention. If `edit/[id]` is a layout route for further nested screens, then it might need to remain a directory with a `_layout.tsx` or be handled according to specific Expo Router patterns for layout routes without an `index.tsx`. For simplicity in this proposal, it's assumed `[id]/index.tsx` represents the screen for that dynamic segment.

This structure will be applied consistently across the `app/TourismCMS/(admin)/` directory.
