import { ShopColors } from '@/constants/ShopColors';
import type { MenuItem, ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Import our organism components
import {
  ShopDetailInfoSection,
  ShopDetailMenuSection,
  ShopDetailPhotosSection,
  ShopDetailPromotionsSection,
  ShopDetailReviewsSection,
} from './details/sections';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HERO_HEIGHT = 280;
const COLLAPSED_HEADER_HEIGHT = 60;

interface ShopDetailProps {
  shop: ShopData | null;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop: initialShopData }) => {
  // State Management
  const [shop] = useState<ShopData | null>(initialShopData);
  const [isLoading] = useState(!initialShopData);
  const [isFavorited, setIsFavorited] = useState(
    initialShopData?.isFavorited || false
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  // Tab Navigation State
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'menu', title: 'Offers' },
    { key: 'promotions', title: 'Promos' },
    { key: 'info', title: 'Info' },
    { key: 'reviews', title: 'Reviews' },
    { key: 'photos', title: 'Photos' },
  ]);

  // Get safe area insets for proper spacing
  const insets = useSafeAreaInsets();

  // Animated Values for Smooth Scrolling
  const scrollY = useRef(new Animated.Value(0)).current;

  // Track collapsed header visibility
  const [isCollapsedHeaderVisible, setIsCollapsedHeaderVisible] =
    useState(false);

  // Event Handlers
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
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make call');
    });
  }, [shop?.contact]);

  const handleDirections = useCallback(() => {
    if (!shop?.mapLocation) return;

    const { latitude, longitude } = shop.mapLocation;
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Unable to open maps');
      });
    }
  }, [shop?.mapLocation]);

  const handleWebsite = useCallback(() => {
    if (!shop?.socialLinks?.website) return;
    Linking.openURL(shop.socialLinks.website).catch(() => {
      Alert.alert('Error', 'Unable to open website');
    });
  }, [shop?.socialLinks?.website]);

  const handleMenuItemPress = useCallback((item: MenuItem) => {
    setSelectedMenuItem(item);
  }, []);

  const handleImagePress = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
  }, []);

  const handleReviewHelpful = useCallback((reviewId: string) => {
    console.log(`Review ${reviewId} marked as helpful`);
  }, []);

  // Animation calculations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT - 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 100, HERO_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const collapsedHeaderTranslateY = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 100, HERO_HEIGHT],
    outputRange: [-COLLAPSED_HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  // Handle scroll to track collapsed header visibility
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsCollapsedHeaderVisible(offsetY > HERO_HEIGHT - 100);
      },
    }
  );

  // Tab Content Renderers - Return as simple components
  const renderTabContent = () => {
    if (!shop) return <View />;

    switch (index) {
      case 0:
        return (
          <ShopDetailMenuSection
            shop={shop}
            onMenuItemPress={handleMenuItemPress}
          />
        );
      case 1:
        return <ShopDetailPromotionsSection shop={shop} />;
      case 2:
        return (
          <ShopDetailInfoSection
            shop={shop}
            onDirectionsPress={handleDirections}
          />
        );
      case 3:
        return (
          <ShopDetailReviewsSection
            shop={shop}
            onImagePress={handleImagePress}
            onHelpfulPress={handleReviewHelpful}
          />
        );
      case 4:
        return (
          <ShopDetailPhotosSection
            shop={shop}
            onImagePress={handleImagePress}
          />
        );
      default:
        return <View />;
    }
  };

  // FlatList Header Component - Contains hero, actions, and tabs
  const renderListHeader = () => {
    if (!shop) return null;

    return (
      <>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: shop.coverImage || shop.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Shop Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.shopInfoOverlay}
          >
            <View style={styles.shopMainInfo}>
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

              {shop.distance && (
                <View style={styles.metric}>
                  <Ionicons name="location" size={16} color="#FFFFFF" />
                  <Text style={styles.metricText}>
                    {shop.distance.toFixed(1)} km
                  </Text>
                </View>
              )}
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

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {routes.map((route, i) => (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabButton, index === i && styles.tabButtonActive]}
              onPress={() => setIndex(i)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  index === i && styles.tabButtonTextActive,
                ]}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  // FlatList Data - Single item containing tab content
  const flatListData = [{ key: 'tabContent', content: renderTabContent() }];

  const renderFlatListItem = ({ item }: { item: any }) => {
    return <View style={styles.tabContentContainer}>{item.content}</View>;
  };

  // Loading State
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

  // Not Found State
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

  // Main Render - Using FlatList instead of ScrollView
  return (
    <View style={styles.container}>
      {/* Main FlatList - No more nested ScrollView! */}
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.key}
        renderItem={renderFlatListItem}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Fixed Header Actions (Always Visible on Hero) */}
      <Animated.View
        style={[
          styles.fixedHeaderActions,
          {
            opacity: headerOpacity,
            top: insets.top + 10,
          },
        ]}
      >
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
      </Animated.View>

      {/* Collapsed Header */}
      <Animated.View
        style={[
          styles.collapsedHeader,
          {
            opacity: collapsedHeaderOpacity,
            transform: [{ translateY: collapsedHeaderTranslateY }],
          },
        ]}
        pointerEvents={isCollapsedHeaderVisible ? 'auto' : 'none'}
      >
        <SafeAreaView edges={['top']} style={styles.collapsedHeaderSafeArea}>
          <View style={styles.collapsedHeaderContent}>
            <TouchableOpacity
              style={styles.collapsedBackButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={ShopColors.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.collapsedShopInfo}>
              <Text style={styles.collapsedShopName} numberOfLines={1}>
                {shop.name}
              </Text>
            </View>

            <View style={styles.collapsedActions}>
              <TouchableOpacity
                style={styles.collapsedActionButton}
                onPress={handleShare}
              >
                <Ionicons
                  name="share-outline"
                  size={20}
                  color={ShopColors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.collapsedActionButton}
                onPress={handleFavoriteToggle}
              >
                <Ionicons
                  name={isFavorited ? 'heart' : 'heart-outline'}
                  size={20}
                  color={
                    isFavorited ? ShopColors.error : ShopColors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Modals */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },

  // FlatList styles
  flatListContent: {
    flexGrow: 1,
  },
  tabContentContainer: {
    flex: 1,
    minHeight: screenHeight, // Ensure content takes full height
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
  shopInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  shopMainInfo: {
    marginBottom: 12,
  },
  shopTitleContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  shopTagline: {
    fontSize: 16,
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

  // Fixed Header Actions
  fixedHeaderActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 22,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 10,
  },

  // Quick Actions Bar
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

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: ShopColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: ShopColors.accent,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textSecondary,
  },
  tabButtonTextActive: {
    color: ShopColors.accent,
    fontFamily: 'Poppins-SemiBold',
  },

  // Collapsed Header
  collapsedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: ShopColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
    zIndex: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  collapsedHeaderSafeArea: {
    backgroundColor: ShopColors.cardBackground,
  },
  collapsedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: COLLAPSED_HEADER_HEIGHT,
  },
  collapsedBackButton: {
    padding: 8,
    marginRight: 8,
  },
  collapsedShopInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  collapsedShopName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  collapsedActions: {
    flexDirection: 'row',
    gap: 8,
  },
  collapsedActionButton: {
    padding: 8,
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