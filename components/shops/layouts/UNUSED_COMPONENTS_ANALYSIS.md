# Unused Components Analysis - Shop Layouts

## Overview
Analysis of component usage in the `components/shops/layouts` directory to identify which components are not being used in the application.

## Analysis Date
May 31, 2025

## Methodology
- Searched for actual imports and usage in `app/**/*.tsx` files
- Checked for component references in application code
- Excluded documentation and export files from usage analysis

## Results

### ✅ **USED COMPONENTS** (12 components)

#### **Categories Folder (2/4 used)**
- ✅ `CategoriesSection.tsx` - Used as `HorizontalCategoriesSection` in shops index page
- ✅ `ShopCategoriesSection.tsx` - Used in category pages  
- ❌ `CompactCategoriesGrid.tsx` - **NOT USED**
- ❌ `HierarchicalCategoriesSection.tsx` - **NOT USED**

#### **Content Folder (3/3 used)**
- ✅ `ShopDetailsContent.tsx` - Used in shop detail tabs
- ✅ `ShopMenuContent.tsx` - Used in shop detail tabs  
- ✅ `ShopReviewsContent.tsx` - Used in shop detail tabs

#### **Pages Folder (3/3 used)**
- ✅ `ShopDetailLayout.tsx` - Used for shop detail pages
- ✅ `ShopDirectoryLayout.tsx` - Used for shop directory
- ✅ `SubCategoryPageLayout.tsx` - Used for subcategory pages

#### **Utils Folder (3/5 used)**
- ✅ `ShopCategoryGrid.tsx` - Used in category and subcategory pages
- ✅ `ShopFeaturedCarousel.tsx` - Used in shops index page
- ✅ `ShopItemList.tsx` - Used in shops index page
- ✅ `ShopTabContainer.tsx` - Used in shop detail pages
- ❌ `HorizontalContainer.tsx` - **NOT USED**

#### **Base Folder (0/2 used directly)**
- 🔄 `BaseCategorySection.tsx` - Used internally by other components
- 🔄 `BaseContentSection.tsx` - Used internally by other components

### ❌ **UNUSED COMPONENTS** (3 components)

1. **`layouts/categories/CompactCategoriesGrid.tsx`**
   - 📊 **Size**: Unknown
   - 🔍 **Usage**: No imports found in app files
   - 💡 **Purpose**: Compact grid layout for categories
   - ⚠️ **Status**: Candidate for removal

2. **`layouts/categories/HierarchicalCategoriesSection.tsx`**
   - 📊 **Size**: Unknown  
   - 🔍 **Usage**: No imports found in app files
   - 💡 **Purpose**: Hierarchical category display
   - ⚠️ **Status**: Candidate for removal

3. **`layouts/utils/HorizontalContainer.tsx`**
   - 📊 **Size**: ~40 lines
   - 🔍 **Usage**: No imports found in app files
   - 💡 **Purpose**: Generic horizontal layout container
   - ⚠️ **Status**: Candidate for removal

## Recommendations

### **Immediate Actions**

1. **Move Unused Components to Archive**
   ```
   mkdir layouts/archive
   move layouts/categories/CompactCategoriesGrid.tsx layouts/archive/
   move layouts/categories/HierarchicalCategoriesSection.tsx layouts/archive/
   move layouts/utils/HorizontalContainer.tsx layouts/archive/
   ```

2. **Update Export Files**
   - Remove exports for unused components from `layouts/index.ts`
   - Remove exports for unused components from main `shops/index.ts`

3. **Update Documentation**
   - Update component counts in documentation
   - Mark archived components in README files

### **Future Considerations**

1. **Code Review**: Before removal, verify these components aren't:
   - Used in features under development
   - Referenced in commented code
   - Part of planned functionality

2. **Gradual Removal**: Consider keeping in archive folder for 1-2 sprints before permanent deletion

## Updated Component Count
- **Total Components**: 17 → 14 active components
- **Categories**: 4 → 2 components  
- **Content**: 3 components (no change)
- **Pages**: 3 components (no change)
- **Utils**: 5 → 4 components
- **Base**: 2 components (no change)
- **Archived**: 0 → 3 components

## Benefits of Cleanup
1. **Reduced Bundle Size**: Remove unused code from builds
2. **Better Maintainability**: Fewer files to maintain and update
3. **Clearer Architecture**: Focus on actually used components
4. **Faster Development**: Less confusion about which components to use

---
**Status**: Analysis Complete  
**Next Step**: Move unused components to archive folder
