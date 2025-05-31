// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\shops\layouts\ShopReviewsContent.tsx
import type { ShopData } from '@/types/shop';
import React from 'react';
import BaseContentSection from '../base/BaseContentSection';

interface ShopReviewsContentProps {
  shop: ShopData;
}

/**
 * ShopReviewsContent - Shop-specific reviews content component
 * 
 * Now powered by BaseContentSection with reviews content type.
 * This component handles the "Reviews" tab content including:
 * - Overall rating display
 * - Rating breakdown (placeholder for now)
 * - Individual reviews display
 * - Empty state when no reviews available
 */
const ShopReviewsContent: React.FC<ShopReviewsContentProps> = ({
  shop,
}) => {
  return (
    <BaseContentSection
      shop={shop}
      contentType="reviews"
      showHeader={false}
      scrollable={false}
      showEmptyState={true}
      emptyStateMessage="No reviews yet. Be the first to leave a review!"
      emptyStateIcon="star-outline"
    />
  );
};

export default ShopReviewsContent;
