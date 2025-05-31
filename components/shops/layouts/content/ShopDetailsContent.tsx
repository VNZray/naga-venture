// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\shops\layouts\ShopDetailsContent.tsx
import type { ShopData } from '@/types/shop';
import React from 'react';
import BaseContentSection from '../base/BaseContentSection';

interface ShopDetailsContentProps {
  shop: ShopData;
}

/**
 * ShopDetailsContent - Shop-specific details content component
 * 
 * Now powered by BaseContentSection with details content type.
 * This component handles the "Details" tab content including:
 * - Description
 * - Contact information
 * - Opening hours
 * - Price range
 * - Additional images
 * - Map/location
 */
const ShopDetailsContent: React.FC<ShopDetailsContentProps> = ({
  shop,
}) => {
  return (
    <BaseContentSection
      shop={shop}
      contentType="details"
      showHeader={false}
      scrollable={false}
      showEmptyState={true}
      emptyStateMessage="No details available for this shop"
      emptyStateIcon="information-circle-outline"
    />
  );
};

export default ShopDetailsContent;
