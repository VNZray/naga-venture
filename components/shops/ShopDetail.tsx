import { ShopColors } from '@/constants/ShopColors';
import type {
  MenuItem,
  ShopAmenity,
  ShopData,
  ShopPromotion,
  ShopReview,
} from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HERO_HEIGHT = 280;
const HEADER_HEIGHT = 120;

// Micro Components
interface RatingBreakdownProps {
  ratingBreakdown?: { 5: number; 4: number; 3: number; 2: number; 1: number };
  totalRatings: number;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  ratingBreakdown,
  totalRatings,
}) => {
  if (!ratingBreakdown) return null;

  return (
    <View style={styles.ratingBreakdownContainer}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count =
          ratingBreakdown[star as keyof typeof ratingBreakdown] || 0;
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        return (
          <View key={star} style={styles.ratingBreakdownRow}>
            <Text style={styles.ratingBreakdownStar}>{star}★</Text>
            <View style={styles.ratingBreakdownBarContainer}>
              <View
                style={[styles.ratingBreakdownBar, { width: `${percentage}%` }]}
              />
            </View>
            <Text style={styles.ratingBreakdownCount}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
};

interface AmenityGridProps {
  amenities: ShopAmenity[];
}

const AmenityGrid: React.FC<AmenityGridProps> = ({ amenities }) => {
  return (
    <View style={styles.amenityGrid}>
      {amenities.map((amenity) => (
        <View
          key={amenity.id}
          style={[styles.amenityItem, { opacity: amenity.available ? 1 : 0.5 }]}
        >
          <View
            style={[
              styles.amenityIcon,
              {
                backgroundColor: amenity.available
                  ? ShopColors.accent + '15'
                  : ShopColors.disabled + '15',
              },
            ]}
          >
            <Ionicons
              name={amenity.icon as any}
              size={20}
              color={
                amenity.available ? ShopColors.accent : ShopColors.disabled
              }
            />
          </View>
          <Text
            style={[
              styles.amenityText,
              {
                color: amenity.available
                  ? ShopColors.textPrimary
                  : ShopColors.disabled,
              },
            ]}
          >
            {amenity.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

interface PromotionCardProps {
  promotion: ShopPromotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  return (
    <View style={styles.promotionCard}>
      <View style={styles.promotionHeader}>
        <View style={styles.promotionBadge}>
          <Text style={styles.promotionBadgeText}>
            {promotion.discountPercent
              ? `${promotion.discountPercent}% OFF`
              : 'SPECIAL OFFER'}
          </Text>
        </View>
        {promotion.validUntil && (
          <Text style={styles.promotionExpiry}>
            Until {new Date(promotion.validUntil).toLocaleDateString()}
          </Text>
        )}
      </View>
      <Text style={styles.promotionTitle}>{promotion.title}</Text>
      <Text style={styles.promotionDescription}>{promotion.description}</Text>
      {promotion.terms && (
        <Text style={styles.promotionTerms}>*{promotion.terms}</Text>
      )}
    </View>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItemCard} onPress={() => onPress(item)}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      )}
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName} numberOfLines={1}>
            {item.item}
          </Text>
          <Text style={styles.menuItemPrice}>{item.price}</Text>
        </View>
        {item.description && (
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.menuItemTags}>
          {item.isPopular && (
            <View style={[styles.menuItemTag, styles.popularTag]}>
              <Text style={styles.popularTagText}>Popular</Text>
            </View>
          )}
          {item.isBestseller && (
            <View style={[styles.menuItemTag, styles.bestsellerTag]}>
              <Text style={styles.bestsellerTagText}>Bestseller</Text>
            </View>
          )}
          {!item.isAvailable && (
            <View style={[styles.menuItemTag, styles.unavailableTag]}>
              <Text style={styles.unavailableTagText}>Unavailable</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface ReviewCardProps {
  review: ShopReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUserInfo}>
          {review.userAvatar ? (
            <Image
              source={{ uri: review.userAvatar }}
              style={styles.reviewUserAvatar}
            />
          ) : (
            <View style={styles.reviewUserAvatarPlaceholder}>
              <Ionicons
                name="person"
                size={16}
                color={ShopColors.textSecondary}
              />
            </View>
          )}
          <View>
            <Text style={styles.reviewUserName}>{review.userName}</Text>
            <View style={styles.reviewRatingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={12}
                  color={
                    star <= review.rating
                      ? ShopColors.warning
                      : ShopColors.border
                  }
                />
              ))}
              <Text style={styles.reviewDate}>
                • {new Date(review.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        {review.isVerifiedPurchase && (
          <View style={styles.verifiedBadge}>
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={ShopColors.success}
            />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <Text style={styles.reviewComment}>{review.comment}</Text>

      {review.images && review.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reviewImages}
        >
          {review.images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.reviewImage}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.reviewHelpfulButton}>
          <Ionicons
            name="thumbs-up-outline"
            size={14}
            color={ShopColors.textSecondary}
          />
          <Text style={styles.reviewHelpfulText}>
            Helpful ({review.helpfulCount || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {review.response && (
        <View style={styles.ownerResponse}>
          <View style={styles.ownerResponseHeader}>
            <Ionicons name="storefront" size={14} color={ShopColors.accent} />
            <Text style={styles.ownerResponseLabel}>Owner Response</Text>
            <Text style={styles.ownerResponseDate}>
              {new Date(review.response.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.ownerResponseText}>
            {review.response.message}
          </Text>
        </View>
      )}
    </View>
  );
};

// Main Component
interface ShopDetailProps {
  shop: ShopData | null;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop: initialShopData }) => {
  const [shop, setShop] = useState<ShopData | null>(initialShopData);
  const [isLoading, setIsLoading] = useState(!initialShopData);
  const [isFavorited, setIsFavorited] = useState(
    initialShopData?.isFavorited || false
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'menu', title: 'Menu' },
    { key: 'info', title: 'Info' },
    { key: 'reviews', title: 'Reviews' },
    { key: 'photos', title: 'Photos' },
  ]);

  const isOpen = useMemo(() => {
    if (!shop?.businessHours || shop.isOpen === undefined)
      return shop?.isOpen ?? true;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', {
      weekday: 'long',
    }).toLowerCase() as keyof typeof shop.businessHours;
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = shop.businessHours[currentDay];
    if (todayHours?.isClosed) return false;

    if (todayHours?.open && todayHours?.close) {
      const openTime = parseInt(todayHours.open.replace(':', ''));
      const closeTime = parseInt(todayHours.close.replace(':', ''));
      return currentTime >= openTime && currentTime <= closeTime;
    }

    return shop.isOpen ?? true;
  }, [shop]);

  const shopStatus = useMemo(() => {
    if (!shop)
      return {
        text: 'Unknown',
        color: ShopColors.textSecondary,
        isOpen: false,
      };
    return isOpen
      ? { text: 'Open', color: ShopColors.success, isOpen: true }
      : { text: 'Closed', color: ShopColors.error, isOpen: false };
  }, [shop, isOpen]);

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorited(!isFavorited);
    if (shop) {
      console.log(`Shop ${shop.id} favorite status: ${!isFavorited}`);
    }
  }, [isFavorited, shop]);

  const handleShare = useCallback(async () => {
    if (!shop) return;

    try {
      await Share.share({
        message: `Check out ${shop.name} on Naga Venture! ${shop.tagline || ''}`,
        url: `nagaventure://shop/${shop.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [shop]);

  const handleCall = useCallback(() => {
    if (!shop?.contact) return;

    const phoneNumber = shop.contact.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  }, [shop?.contact]);

  const handleDirections = useCallback(() => {
    if (!shop?.mapLocation) return;

    const { latitude, longitude } = shop.mapLocation;
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  }, [shop?.mapLocation]);

  const handleWebsite = useCallback(() => {
    if (!shop?.socialLinks?.website) return;
    Linking.openURL(shop.socialLinks.website);
  }, [shop?.socialLinks?.website]);

  const handleMenuItemPress = useCallback((item: MenuItem) => {
    setSelectedMenuItem(item);
  }, []);

  const renderMenuTab = useCallback(() => {
    if (!shop?.menu || shop.menu.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="restaurant-outline"
            size={48}
            color={ShopColors.textSecondary}
          />
          <Text style={styles.emptyStateTitle}>No Menu Available</Text>
          <Text style={styles.emptyStateText}>
            This business hasn&apos;t uploaded their menu yet.
          </Text>
        </View>
      );
    }

    const featuredItems = shop.menu.filter(
      (item) =>
        shop.featuredItems?.includes(item.id) ||
        item.isPopular ||
        item.isBestseller
    );

    const categories = [
      ...new Set(shop.menu.map((item) => item.category).filter(Boolean)),
    ];

    return (
      <ScrollView
        style={styles.tabContent}
        showsVerticalScrollIndicator={false}
      >
        {featuredItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Items</Text>
            {featuredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onPress={handleMenuItemPress}
              />
            ))}
          </View>
        )}

        {categories.map((category) => {
          const categoryItems = shop.menu!.filter(
            (item) => item.category === category
          );
          return (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Uncategorized'}
              </Text>
              {categoryItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onPress={handleMenuItemPress}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    );
  }, [shop, handleMenuItemPress]);

  const renderInfoTab = useCallback(() => {
    if (!shop) return null;

    return (
      <ScrollView
        style={styles.tabContent}
        showsVerticalScrollIndicator={false}
      >
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {shop.name}</Text>
          <Text style={styles.aboutText}>{shop.story || shop.description}</Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Location</Text>

          {shop.location && (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleDirections}
            >
              <Ionicons name="location" size={20} color={ShopColors.accent} />
              <Text style={styles.contactText}>{shop.location}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={ShopColors.textSecondary}
              />
            </TouchableOpacity>
          )}

          {shop.contact && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Ionicons name="call" size={20} color={ShopColors.accent} />
              <Text style={styles.contactText}>{shop.contact}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={ShopColors.textSecondary}
              />
            </TouchableOpacity>
          )}

          {shop.email && (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(`mailto:${shop.email}`)}
            >
              <Ionicons name="mail" size={20} color={ShopColors.accent} />
              <Text style={styles.contactText}>{shop.email}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={ShopColors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Social Links */}
        {shop.socialLinks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow Us</Text>
            <View style={styles.socialLinks}>
              {shop.socialLinks.facebook && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(shop.socialLinks!.facebook!)}
                >
                  <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              )}

              {shop.socialLinks.instagram && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(shop.socialLinks!.instagram!)}
                >
                  <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                  <Text style={styles.socialButtonText}>Instagram</Text>
                </TouchableOpacity>
              )}

              {shop.socialLinks.website && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleWebsite}
                >
                  <Ionicons name="globe" size={24} color={ShopColors.accent} />
                  <Text style={styles.socialButtonText}>Website</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Business Hours */}
        {shop.businessHours && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.businessHours}>
              {Object.entries(shop.businessHours).map(([day, hours]) => (
                <View key={day} style={styles.businessHourRow}>
                  <Text style={styles.businessHourDay}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                  <Text style={styles.businessHourTime}>
                    {hours.isClosed
                      ? 'Closed'
                      : `${hours.open} - ${hours.close}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Amenities */}
        {shop.amenities && shop.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities & Features</Text>
            <AmenityGrid amenities={shop.amenities} />
          </View>
        )}

        {/* Promotions */}
        {shop.promotions &&
          shop.promotions.filter((p) => p.isActive).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Promotions</Text>
              {shop.promotions
                .filter((p) => p.isActive)
                .map((promotion) => (
                  <PromotionCard key={promotion.id} promotion={promotion} />
                ))}
            </View>
          )}
      </ScrollView>
    );
  }, [shop, handleDirections, handleCall, handleWebsite]);

  const renderReviewsTab = useCallback(() => {
    if (!shop?.reviews || shop.reviews.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="chatbubbles-outline"
            size={48}
            color={ShopColors.textSecondary}
          />
          <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
          <Text style={styles.emptyStateText}>
            Be the first to leave a review!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.tabContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reviews Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <View style={styles.reviewsSummary}>
            <View style={styles.reviewsSummaryLeft}>
              <Text style={styles.reviewsAverageRating}>
                {shop.rating.toFixed(1)}
              </Text>
              <View style={styles.reviewsStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={
                      star <= shop.rating
                        ? ShopColors.warning
                        : ShopColors.border
                    }
                  />
                ))}
              </View>
              <Text style={styles.reviewsCount}>
                Based on {shop.ratingCount} reviews
              </Text>
            </View>

            <View style={styles.reviewsSummaryRight}>
              <RatingBreakdown
                ratingBreakdown={shop.ratingBreakdown}
                totalRatings={shop.ratingCount}
              />
            </View>
          </View>
        </View>

        {/* Individual Reviews */}
        <View style={styles.section}>
          {shop.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      </ScrollView>
    );
  }, [shop]);

  const renderPhotosTab = useCallback(() => {
    const allImages = [
      ...(shop?.gallery || []),
      ...(shop?.additionalImages?.map((url, index) => ({
        id: `additional-${index}`,
        url,
        type: 'shop' as const,
        caption: '',
      })) || []),
    ];

    if (allImages.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="images-outline"
            size={48}
            color={ShopColors.textSecondary}
          />
          <Text style={styles.emptyStateTitle}>No Photos Available</Text>
          <Text style={styles.emptyStateText}>
            This business hasn&apos;t uploaded photos yet.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={allImages}
        numColumns={2}
        style={styles.photosGrid}
        contentContainerStyle={styles.photosGridContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.photoItem}
            onPress={() => setSelectedImage(item.url)}
          >
            <Image source={{ uri: item.url }} style={styles.photoImage} />
            {item.caption && (
              <View style={styles.photoCaption}>
                <Text style={styles.photoCaptionText} numberOfLines={2}>
                  {item.caption}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }, [shop]);

  const renderScene = SceneMap({
    menu: renderMenuTab,
    info: renderInfoTab,
    reviews: renderReviewsTab,
    photos: renderPhotosTab,
  });

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        activeColor={ShopColors.accent}
        inactiveColor={ShopColors.textSecondary}
        scrollEnabled
        tabStyle={styles.tabStyle}
      />
    ),
    []
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ShopColors.accent} />
          <Text style={styles.loadingText}>Loading Shop Details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!shop) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFoundContainer}>
          <Ionicons
            name="storefront-outline"
            size={60}
            color={ShopColors.textSecondary}
          />
          <Text style={styles.notFoundTitle}>Shop Not Found</Text>
          <Text style={styles.notFoundText}>
            The shop you are looking for does not exist or could not be loaded.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.goBackButton}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: shop.coverImage || shop.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Status Overlay */}
        {!shopStatus.isOpen && (
          <View style={styles.statusOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={styles.statusOverlayGradient}
            >
              <Text style={styles.statusOverlayText}>CLOSED</Text>
              <Text style={styles.statusOverlaySubtext}>
                {shop.temporaryHours || 'See business hours below'}
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleFavoriteToggle}
            >
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorited ? ShopColors.error : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop Info Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.shopInfoOverlay}
        >
          <View style={styles.shopMainInfo}>
            {shop.logo && (
              <Image source={{ uri: shop.logo }} style={styles.shopLogo} />
            )}
            <View style={styles.shopTitleContainer}>
              <Text style={styles.shopName}>{shop.name}</Text>
              {shop.tagline && (
                <Text style={styles.shopTagline}>{shop.tagline}</Text>
              )}
            </View>
          </View>

          <View style={styles.shopMetrics}>
            <View style={styles.metric}>
              <Ionicons name="star" size={16} color={ShopColors.warning} />
              <Text style={styles.metricText}>
                {shop.rating.toFixed(1)} ({shop.ratingCount})
              </Text>
            </View>

            {shop.stats?.followerCount && (
              <View style={styles.metric}>
                <Ionicons name="people" size={16} color="#FFFFFF" />
                <Text style={styles.metricText}>
                  {shop.stats.followerCount.toLocaleString()} followers
                </Text>
              </View>
            )}

            {shop.distance && (
              <View style={styles.metric}>
                <Ionicons name="location" size={16} color="#FFFFFF" />
                <Text style={styles.metricText}>
                  {shop.distance.toFixed(1)} km
                </Text>
              </View>
            )}

            <View style={[styles.metric, styles.statusMetric]}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: shopStatus.color },
                ]}
              />
              <Text style={styles.metricText}>{shopStatus.text}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions Bar */}
      <View style={styles.quickActionsBar}>
        {shop.contact && (
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color={ShopColors.accent} />
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
        )}

        {shop.mapLocation && (
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleDirections}
          >
            <Ionicons name="navigate" size={20} color={ShopColors.accent} />
            <Text style={styles.quickActionText}>Directions</Text>
          </TouchableOpacity>
        )}

        {shop.socialLinks?.website && (
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleWebsite}
          >
            <Ionicons name="globe" size={20} color={ShopColors.accent} />
            <Text style={styles.quickActionText}>Website</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={20} color={ShopColors.accent} />
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />

      {/* Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.imageModalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Menu Item Modal */}
      <Modal
        visible={!!selectedMenuItem}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMenuItem(null)}
      >
        <View style={styles.menuModalContainer}>
          <View style={styles.menuModalContent}>
            <TouchableOpacity
              style={styles.menuModalClose}
              onPress={() => setSelectedMenuItem(null)}
            >
              <Ionicons name="close" size={24} color={ShopColors.textPrimary} />
            </TouchableOpacity>

            {selectedMenuItem && (
              <>
                {selectedMenuItem.image && (
                  <Image
                    source={{ uri: selectedMenuItem.image }}
                    style={styles.menuModalImage}
                  />
                )}
                <View style={styles.menuModalInfo}>
                  <Text style={styles.menuModalName}>
                    {selectedMenuItem.item}
                  </Text>
                  <Text style={styles.menuModalPrice}>
                    {selectedMenuItem.price}
                  </Text>
                  {selectedMenuItem.description && (
                    <Text style={styles.menuModalDescription}>
                      {selectedMenuItem.description}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },

  // Hero Section
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  statusOverlayGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOverlayText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  statusOverlaySubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  headerActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  shopInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  shopMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  shopTitleContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shopTagline: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shopMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusMetric: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Quick Actions
  quickActionsBar: {
    flexDirection: 'row',
    backgroundColor: ShopColors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
    marginTop: 4,
  },

  // Tab View
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: ShopColors.cardBackground,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  tabIndicator: {
    backgroundColor: ShopColors.accent,
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 16,
  },
  tabContent: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  // Menu Items
  menuItemCard: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemImage: {
    width: '100%',
    height: 120,
  },
  menuItemContent: {
    padding: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  menuItemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuItemTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularTag: {
    backgroundColor: ShopColors.warning + '20',
  },
  popularTagText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.warning,
  },
  bestsellerTag: {
    backgroundColor: ShopColors.success + '20',
  },
  bestsellerTagText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.success,
  },
  unavailableTag: {
    backgroundColor: ShopColors.error + '20',
  },
  unavailableTagText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.error,
  },

  // About & Info
  aboutText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
    marginLeft: 12,
  },

  // Social Links
  socialLinks: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ShopColors.cardBackground,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ShopColors.border,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
  },

  // Business Hours
  businessHours: {
    paddingHorizontal: 20,
  },
  businessHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  businessHourDay: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
  },
  businessHourTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },

  // Amenities
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  amenityItem: {
    alignItems: 'center',
    width: (screenWidth - 40 - 24) / 3, // 3 columns with gaps
    marginBottom: 16,
  },
  amenityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Promotions
  promotionCard: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.accent + '30',
    borderLeftWidth: 4,
    borderLeftColor: ShopColors.accent,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionBadge: {
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promotionBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  promotionExpiry: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  promotionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 4,
  },
  promotionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  promotionTerms: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    fontStyle: 'italic',
  },

  // Reviews
  reviewsSummary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  reviewsSummaryLeft: {
    alignItems: 'center',
    marginRight: 24,
  },
  reviewsAverageRating: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
  },
  reviewsStars: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 2,
  },
  reviewsCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
  },
  reviewsSummaryRight: {
    flex: 1,
  },
  ratingBreakdownContainer: {
    gap: 4,
  },
  ratingBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBreakdownStar: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    width: 20,
  },
  ratingBreakdownBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: ShopColors.border,
    borderRadius: 3,
  },
  ratingBreakdownBar: {
    height: '100%',
    backgroundColor: ShopColors.warning,
    borderRadius: 3,
  },
  ratingBreakdownCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    width: 20,
    textAlign: 'right',
  },

  // Individual Reviews
  reviewCard: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ShopColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewUserName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.success,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImages: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewHelpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewHelpfulText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  ownerResponse: {
    backgroundColor: ShopColors.accent + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  ownerResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  ownerResponseLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.accent,
    flex: 1,
  },
  ownerResponseDate: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  ownerResponseText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
    lineHeight: 18,
  },

  // Photos Grid
  photosGrid: {
    flex: 1,
  },
  photosGridContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  photoItem: {
    width: (screenWidth - 48) / 2,
    marginHorizontal: 4,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: ShopColors.cardBackground,
    elevation: 2,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoImage: {
    width: '100%',
    height: 120,
  },
  photoCaption: {
    padding: 8,
  },
  photoCaptionText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },

  // Empty States
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notFoundTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  goBackButton: {
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },

  // Modals
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  imageModalImage: {
    width: screenWidth - 40,
    height: screenHeight - 200,
  },
  menuModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuModalContent: {
    backgroundColor: ShopColors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  menuModalClose: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  menuModalImage: {
    width: '100%',
    height: 200,
  },
  menuModalInfo: {
    padding: 20,
  },
  menuModalName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
    marginBottom: 8,
  },
  menuModalPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
    marginBottom: 12,
  },
  menuModalDescription: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 22,
  },
});

export default ShopDetail;
