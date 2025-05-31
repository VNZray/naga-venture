# Shop Layouts Directory Cleanup Plan 🧹

## Current Situation
The `components/shops/layouts` directory is cluttered with multiple versions of files:
- Original files (no suffix)
- _NEW versions (manual edits)
- _OLD versions (backups)
- _OPTIMIZED versions (temporary)
- _BROKEN versions (corrupted files)

## Cleanup Strategy

### Step 1: Identify Best Versions
- Compare content of original vs _NEW vs _OPTIMIZED files
- Keep the best working version as the main file
- Remove redundant versions

### Step 2: Consolidate Files
- Keep only the working versions
- Move backups to a separate backup folder
- Clean up index.ts exports

### Step 3: Organize Structure
```
layouts/
├── index.ts                     # Clean exports
├── README.md                    # Documentation
│
├── base/                        # Base components
│   ├── BaseCategorySection.tsx
│   └── BaseContentSection.tsx
│
├── categories/                  # Category components
│   ├── CategoriesSection.tsx
│   ├── CompactCategoriesGrid.tsx
│   ├── HierarchicalCategoriesSection.tsx
│   └── ShopCategoriesSection.tsx
│
├── content/                     # Content components
│   ├── ShopDetailsContent.tsx
│   ├── ShopMenuContent.tsx
│   └── ShopReviewsContent.tsx
│
├── pages/                       # Page layouts
│   ├── ShopDetailLayout.tsx
│   ├── ShopDirectoryLayout.tsx
│   └── SubCategoryPageLayout.tsx
│
├── utils/                       # Utility components
│   ├── HorizontalContainer.tsx
│   ├── ShopCategoryGrid.tsx
│   ├── ShopFeaturedCarousel.tsx
│   ├── ShopItemList.tsx
│   └── ShopTabContainer.tsx
│
└── backup/                      # Backup files
    ├── *_OLD.tsx
    ├── *_BROKEN.tsx
    └── *_OPTIMIZED.tsx
```

## Action Items
1. Create organized folder structure
2. Move files to appropriate folders
3. Update import paths in index.ts
4. Test all exports work correctly
5. Update documentation
