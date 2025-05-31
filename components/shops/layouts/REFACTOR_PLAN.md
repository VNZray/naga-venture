# Shop Layouts Refactoring Plan 🏗️

## 🎯 Current Issues Identified

### **Category Components Duplication (5 components with 70% overlap)**
```
❌ CategoriesSection.tsx (195 lines) - Horizontal categories
❌ CompactCategoriesGrid.tsx (154 lines) - Grid categories  
❌ HierarchicalCategoriesSection.tsx (198 lines) - Main + subcategories
❌ ShopCategoriesSection.tsx (154 lines) - Shop-specific categories
❌ ShopCategoryGrid.tsx (169 lines) - Shop category grid
```
**Total:** ~870 lines with significant duplication

### **Content Components Pattern Needed**
```
⚠️ ShopDetailsContent.tsx (220 lines) - Details tab
⚠️ ShopMenuContent.tsx (86 lines) - Menu tab
⚠️ ShopReviewsContent.tsx (112 lines) - Reviews tab
```
**Issue:** Similar structure, could benefit from base content component

### **Layout Components Inconsistencies**
```
⚠️ ShopDetailLayout.tsx vs subCategoryPageLayout.tsx - Similar patterns
⚠️ ShopDirectoryLayout.tsx - Could be more modular
⚠️ Naming: subCategoryPageLayout.tsx should be PascalCase
```

## 🚀 Proposed Refactoring Solution

### **Phase 1: Category Components Unification**
Create `BaseCategorySection.tsx` that handles:
- **Layout Types**: `horizontal`, `grid`, `hierarchical`
- **Display Modes**: `compact`, `detailed`, `icon-only`
- **Interaction Patterns**: Single-level, hierarchical, expandable
- **Customization**: Item rendering, spacing, styling

**Result**: Reduce 5 components (870 lines) → 1 base + 5 specialized (estimated 300 lines total)

### **Phase 2: Content Components Pattern**
Create `BaseContentSection.tsx` for tab content:
- **Content Types**: `details`, `menu`, `reviews`, `photos`
- **Layout Patterns**: List, grid, custom
- **Empty States**: Unified empty state handling
- **Loading States**: Consistent loading patterns

### **Phase 3: Layout Standardization**
- Rename `subCategoryPageLayout.tsx` → `SubCategoryPageLayout.tsx`
- Create `BasePageLayout.tsx` for common layout patterns
- Standardize prop interfaces and naming conventions

### **Phase 4: Performance & Polish**
- Add React.memo, useCallback, useMemo optimizations
- Create shared hooks for layout logic
- Add comprehensive documentation

## 📊 Expected Benefits

- **~60-70% Code Reduction** in category components
- **Consistent UX** across all category displays
- **Better Maintainability** with single source of truth
- **Improved Performance** with memoization
- **Clear Architecture** with predictable patterns

## 🛠️ Implementation Priority

1. **HIGH**: Category components (biggest impact)
2. **MEDIUM**: Content components standardization  
3. **LOW**: Layout consistency and naming
4. **POLISH**: Performance optimizations

Would you like to proceed with this refactoring plan?
