// Base Content Section Component - Simplified for performance
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Content type definitions
export type ContentType = 'details' | 'menu' | 'reviews' | 'photos' | 'contact';

// Color scheme interface
interface ContentColorScheme {
  backgroundColor: string;
  textColor: string;
  sectionBackgroundColor: string;
  borderColor: string;
  accentColor: string;
  mutedTextColor: string;
  emptyStateColor: string;
}

// Section data interface for flexible content
export interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'contact' | 'rating' | 'custom';
  data?: any;
  customRender?: (data: any, colors: ContentColorScheme) => React.ReactElement;
}

// Custom render function types
export type ContentRenderFunction = (
  shop: ShopData,
  colors: ContentColorScheme
) => React.ReactElement;

interface BaseContentSectionProps {
  // Core data
  shop: ShopData;
  contentType: ContentType;
  
  // Content configuration
  sections?: ContentSection[];
  title?: string;
  
  // Display options
  showHeader?: boolean;
  customRender?: ContentRenderFunction;
  customStyles?: Partial<typeof styles>;
  scrollable?: boolean;
  
  // Empty state
  showEmptyState?: boolean;
  emptyStateMessage?: string;
  emptyStateIcon?: string;
  
  // Callbacks
  onActionPress?: (action: string, data?: any) => void;
}

/**
 * BaseContentSection - Simplified base component for all shop tab content
 * 
 * Supports multiple content types:
 * - details: Shop description, contact info, hours, etc.
 * - menu: Menu items, pricing, categories
 * - reviews: Ratings, reviews, review breakdown
 * - photos: Photo gallery, additional images
 * - contact: Contact information, directions, hours
 * 
 * Features:
 * - Flexible section-based content system
 * - Consistent styling and theming
 * - Empty state handling
 * - Action callbacks for interactions
 * - Custom rendering support
 */
const BaseContentSection: React.FC<BaseContentSectionProps> = ({
  shop,
  contentType,
  sections = [],
  title,
  showHeader = true,
  customRender,
  customStyles = {},
  scrollable = true,
  showEmptyState = true,
  emptyStateMessage,
  emptyStateIcon = "information-circle-outline",
  onActionPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Simple color scheme
  const colors: ContentColorScheme = {
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    textColor: isDark ? "#ffffff" : "#1f2937",
    sectionBackgroundColor: isDark ? "#2a2a2a" : "#f8f9fa",
    borderColor: isDark ? "#404040" : "#e9ecef",
    accentColor: isDark ? "#60a5fa" : "#3b82f6",
    mutedTextColor: isDark ? "#9ca3af" : "#6b7280",
    emptyStateColor: isDark ? "#6b7280" : "#9ca3af",
  };
  
  // Simple styles
  const dynamicStyles = {
    container: [
      styles.container,
      { backgroundColor: colors.backgroundColor },
      customStyles.container,
    ],
    section: [
      styles.section,
      { backgroundColor: colors.sectionBackgroundColor, borderColor: colors.borderColor },
      customStyles.section,
    ],
    header: [
      styles.header,
      customStyles.header,
    ],
  };
  
  // Action handlers
  const handleCall = () => {
    if (shop.contact) {
      Linking.openURL(`tel:${shop.contact}`);
      onActionPress?.('call', shop.contact);
    }
  };
  
  const handleDirections = () => {
    if (shop.mapLocation) {
      const { latitude, longitude } = shop.mapLocation;
      Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
      onActionPress?.('directions', shop.mapLocation);
    }
  };
  
  const handleWebsite = () => {
    if (shop.website) {
      Linking.openURL(shop.website);
      onActionPress?.('website', shop.website);
    }
  };
  
  // Star rating renderer
  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={size}
          color={i <= rating ? "#FFD700" : colors.mutedTextColor}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  // Default content renderers by type
  const renderDefaultContent = () => {
    switch (contentType) {
      case 'details':
        return renderDetailsContent();
      case 'menu':
        return renderMenuContent();
      case 'reviews':
        return renderReviewsContent();
      case 'contact':
        return renderContactContent();
      default:
        return renderGenericContent();
    }
  };
  
  const renderDetailsContent = () => (
    <View>
      {shop.description && (
        <View style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            About
          </Text>
          <Text style={[styles.description, { color: colors.textColor }]}>
            {shop.description}
          </Text>
        </View>
      )}
      
      {shop.contact && (
        <View style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            Contact Information
          </Text>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call" size={20} color={colors.accentColor} />
            <Text style={[styles.contactText, { color: colors.accentColor }]}>
              {shop.contact}
            </Text>
          </TouchableOpacity>
        </View>
      )}      
      {shop.location && (
        <View style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            Location
          </Text>
          <TouchableOpacity style={styles.contactItem} onPress={handleDirections}>
            <Ionicons name="location" size={20} color={colors.accentColor} />
            <Text style={[styles.contactText, { color: colors.textColor }]}>
              {shop.location}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {shop.openingHours && (
        <View style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            Opening Hours
          </Text>
          <Text style={[styles.description, { color: colors.textColor }]}>
            {shop.openingHours}
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderMenuContent = () => (
    <View style={dynamicStyles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
        Menu & Offerings
      </Text>
      {shop.menu && shop.menu.length > 0 ? (
        shop.menu.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <Text style={[styles.menuItemName, { color: colors.textColor }]}>
              {item.item}
            </Text>
            <Text style={[styles.menuItemPrice, { color: colors.accentColor }]}>
              ₱{item.price}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.emptyText, { color: colors.mutedTextColor }]}>
          Menu information not available
        </Text>
      )}
    </View>
  );
  
  const renderReviewsContent = () => (
    <View>
      <View style={dynamicStyles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
          Overall Rating
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingNumber, { color: colors.textColor }]}>
            {shop.rating?.toFixed(1) || 'N/A'}
          </Text>
          {renderStars(Math.round(shop.rating || 0), 20)}
          <Text style={[styles.reviewCount, { color: colors.mutedTextColor }]}>
            ({(shop as any).reviewCount || 0} reviews)
          </Text>
        </View>
      </View>
      
      {(!shop.reviews || shop.reviews.length === 0) && (
        <View style={dynamicStyles.section}>
          <Text style={[styles.emptyText, { color: colors.mutedTextColor }]}>
            No reviews yet. Be the first to leave a review!
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderContactContent = () => (
    <View>
      {shop.contact && (
        <TouchableOpacity style={[dynamicStyles.section, styles.actionSection]} onPress={handleCall}>
          <Ionicons name="call" size={24} color={colors.accentColor} />
          <Text style={[styles.actionText, { color: colors.textColor }]}>
            Call {shop.contact}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedTextColor} />
        </TouchableOpacity>
      )}      
      {shop.website && (
        <TouchableOpacity style={[dynamicStyles.section, styles.actionSection]} onPress={handleWebsite}>
          <Ionicons name="globe" size={24} color={colors.accentColor} />
          <Text style={[styles.actionText, { color: colors.textColor }]}>
            Visit Website
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedTextColor} />
        </TouchableOpacity>
      )}
      
      {shop.mapLocation && (
        <TouchableOpacity style={[dynamicStyles.section, styles.actionSection]} onPress={handleDirections}>
          <Ionicons name="navigate" size={24} color={colors.accentColor} />
          <Text style={[styles.actionText, { color: colors.textColor }]}>
            Get Directions
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedTextColor} />
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderGenericContent = () => (
    <View>
      {sections.map((section) => (
        <View key={section.id} style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            {section.title}
          </Text>
          {section.customRender ? (
            section.customRender(section.data, colors)
          ) : (
            <Text style={[styles.description, { color: colors.textColor }]}>
              {JSON.stringify(section.data)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
  
  // Render header
  const renderHeader = () => (
    showHeader && title && (
      <View style={dynamicStyles.header}>
        <Text style={[styles.title, { color: colors.textColor }]}>
          {title}
        </Text>
      </View>
    )
  );
  
  // Render empty state
  const renderEmptyState = () => (
    showEmptyState && (
      <View style={styles.emptyState}>
        <Ionicons 
          name={emptyStateIcon as any} 
          size={48} 
          color={colors.emptyStateColor} 
        />
        <Text style={[styles.emptyStateText, { color: colors.emptyStateColor }]}>
          {emptyStateMessage || `No ${contentType} information available`}
        </Text>
      </View>
    )
  );
  
  // Main content
  const content = customRender ? customRender(shop, colors) : renderDefaultContent();
  
  // Check if content is empty
  const isEmpty = !shop.description && !shop.contact && !shop.menu?.length && !shop.reviews?.length;
  
  const mainContent = (
    <View style={dynamicStyles.container}>
      {renderHeader()}
      {isEmpty ? renderEmptyState() : content}
    </View>
  );

  return scrollable ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      {mainContent}
    </ScrollView>
  ) : (
    mainContent
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCount: {
    fontSize: 12,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default BaseContentSection;
