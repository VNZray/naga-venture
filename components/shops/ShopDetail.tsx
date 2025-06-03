import { ShopColors } from '@/constants/ShopColors';
import type { ShopData, MenuItem } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useCallback, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Linking,
  Platform,
  Share,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';

// Import our organism components
import {
  ShopDetailMenuSection,
  ShopDetailInfoSection,
  ShopDetailReviewsSection,
  ShopDetailPhotosSection,
} from './details/sections';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HERO_HEIGHT = 280;

interface ShopDetailProps {
  shop: ShopData | null;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop: initialShopData }) => {
  // State Management
  const [shop] = useState<ShopData | null>(initialShopData);
  const [isLoading] = useState(!initialShopData);
  const [isFavorited, setIsFavorited] = useState(initialShopData?.isFavorited || false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  // Tab Navigation State
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'menu', title: 'Menu' },
    { key: 'info', title: 'Info' },
    { key: 'reviews', title: 'Reviews' },
    { key: 'photos', title: 'Photos' },
  ]);

  // Computed Values
  const isOpen = useMemo(() => {
    if (!shop?.businessHours || shop.isOpen === undefined) return shop?.isOpen ?? true;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof shop.businessHours;
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
    if (!shop) return { text: 'Unknown', color: ShopColors.textSecondary, isOpen: false };
    return isOpen
      ? { text: 'Open', color: ShopColors.success, isOpen: true }
      : { text: 'Closed', color: ShopColors.error, isOpen: false };
  }, [shop, isOpen]);

  // Event Handlers
  const handleFavoriteToggle = useCallback(() => {
    setIsFavorited(!isFavorited);
    if (shop) {
      console.log(`Shop ${shop.id} favorite status: ${!isFavorited}`);
      // TODO: Persist to backend/storage
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
    // TODO: Implement helpful review logic
  }, []);

  // Tab Content Renderers using Organisms
  const renderMenuTab = useCallback(() => {
    if (!shop) return null;
    return (
      <ShopDetailMenuSection 
        shop={shop} 
        onMenuItemPress={handleMenuItemPress} 
      />
    );
  }, [shop, handleMenuItemPress]);

  const renderInfoTab = useCallback(() => {
    if (!shop) return null;
    return (
      <ShopDetailInfoSection 
        shop={shop} 
        onDirectionsPress={handleDirections} 
      />
    );
  }, [shop, handleDirections]);

  const renderReviewsTab = useCallback(() => {
    if (!shop) return null;
    return (
      <ShopDetailReviewsSection 
        shop={shop} 
        onImagePress={handleImagePress}
        onHelpfulPress={handleReviewHelpful}
      />
    );
  }, [shop, handleImagePress, handleReviewHelpful]);

  const renderPhotosTab = useCallback(() => {
    if (!shop) return null;
    return (
      <ShopDetailPhotosSection
        shop={shop}
        onImagePress={handleImagePress}
      />
    );
  }, [shop, handleImagePress]);

  const renderScene = SceneMap({
    menu: renderMenuTab,
    info: renderInfoTab,
    reviews: renderReviewsTab,
    photos: renderPhotosTab,
  });

  const renderTabBar = useCallback((props: any) => (
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
  ), []);

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
          <Ionicons name="storefront-outline" size={60} color={ShopColors.textSecondary} />
          <Text style={styles.notFoundTitle}>Shop Not Found</Text>
          <Text style={styles.notFoundText}>
            The shop you are looking for does not exist or could not be loaded.
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main Render
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Hero Section with Shop Info */}
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: shop.coverImage || shop.image }} 
          style={styles.heroImage} 
          resizeMode="cover" 
        />
        
        {/* Status Overlay for Closed Shops */}
        {!shopStatus.isOpen && (
          <View style={styles.statusOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={styles.statusOverlayGradient}
            >
              <Text style={styles.statusOverlayText}>CLOSED</Text>
              <Text style={styles.statusOverlaySubtext}>
                {shop.temporaryHours || 'See business hours in info tab'}
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleFavoriteToggle}>
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
                <Text style={styles.metricText}>{shop.distance.toFixed(1)} km</Text>
              </View>
            )}
            
            <View style={[styles.metric, styles.statusMetric]}>
              <View style={[styles.statusDot, { backgroundColor: shopStatus.color }]} />
              <Text style={styles.metricText}>{shopStatus.text}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions Bar */}
      <View style={styles.quickActionsBar}>
        {shop.contact && (
          <TouchableOpacity style={styles.quickActionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={ShopColors.accent} />
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
        )}
        
        {shop.mapLocation && (
          <TouchableOpacity style={styles.quickActionButton} onPress={handleDirections}>
            <Ionicons name="navigate" size={20} color={ShopColors.accent} />
            <Text style={styles.quickActionText}>Directions</Text>
          </TouchableOpacity>
        )}
        
        {shop.socialLinks?.website && (
          <TouchableOpacity style={styles.quickActionButton} onPress={handleWebsite}>
            <Ionicons name="globe" size={20} color={ShopColors.accent} />
            <Text style={styles.quickActionText}>Website</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.quickActionButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color={ShopColors.accent} />
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content - Now using Organism Components! */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />

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
                  <Text style={styles.menuModalName}>{selectedMenuItem.item}</Text>
                  <Text style={styles.menuModalPrice}>{selectedMenuItem.price}</Text>
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