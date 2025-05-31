// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\shops\layouts\ShopMenuContent.tsx
import type { ShopData } from '@/types/shop';
import React from 'react';
import BaseContentSection from '../base/BaseContentSection';

interface ShopMenuContentProps {
  shop: ShopData;
}

/**
 * ShopMenuContent - Shop-specific menu content component
 * 
 * Now powered by BaseContentSection with menu content type.
 * This component handles the "Menu" tab content including:
 * - Menu items display
 * - Pricing information
 * - Empty state when no menu available
 */
const ShopMenuContent: React.FC<ShopMenuContentProps> = ({
  shop,
}) => {
  return (
    <BaseContentSection
      shop={shop}
      contentType="menu"
      showHeader={false}
      scrollable={false}
      showEmptyState={true}
      emptyStateMessage="Menu information not available"
      emptyStateIcon="restaurant-outline"
    />
  );
};

export default ShopMenuContent;
