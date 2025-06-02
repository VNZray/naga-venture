import { ShopColors } from '@/constants/ShopColors';
import type { ShopData, MenuItem, ShopReview } from '@/types/shop'; // Assuming MenuItem and ShopReview are defined
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'; // yarn add react-native-tab-view

// --- Mock Components (Create these as separate files later) ---
interface ProductMenuCardProps { item: MenuItem, onPress: (item: MenuItem) => void }
const ProductMenuCard: React.FC<ProductMenuCardProps> = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} style={styles.productCard}>
    {/* Add placeholder for item.image if available */}
    <Text style={styles.productName}>{item.item}</Text>
    <Text style={styles.productPrice}>{item.price}</Text>
    {item.description && <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>}
  </TouchableOpacity>
);

interface ReviewCardProps { review: ShopReview }
const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewUserName}>{review.userName}</Text>
      <View style={styles.reviewRating}>
        <Ionicons name="star" size={14} color={ShopColors.warning} />
        <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
      </View>
    </View>
    <Text style={styles.reviewComment}>{review.comment}</Text>
    <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
  </View>
);
// --- End Mock Components ---


interface ShopDetailProps {
  shop: ShopData | null; // Shop data can be null if not found
}

const initialLayout = { width: Dimensions.get('window').width };

const ShopDetail: React.FC<ShopDetailProps> = ({ shop: initialShopData }) => {
  const [shop, setShop] = useState<ShopData | null>(initialShopData);
  const [isLoading, setIsLoading] = useState(!initialShopData); // True if no initial data
  const [isFavorited, setIsFavorited] = useState(false); // Manage favorite state

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'menu', title: 'Menu/Services' }, // Dynamic title based on shop type?
    { key: 'info', title: 'Info & Hours' },
    { key: 'reviews', title: 'Reviews' },
    // { key: 'promos', title: 'Offers' }, // Optional tab
  ]);

  // Simulate fetching more shop details if needed, or use initialShopData directly
  useEffect(() => {
    if (!initialShopData && router.params?.shopId) { // Assuming shopId is a param
      // const fetchShop = async () => {
      //   setIsLoading(true);
      //   // const fetchedShop = await getShopById(router.params.shopId); // Your fetch function
      //   // setShop(fetchedShop);
      //   // setIsFavorited(fetchedShop?.isFavorited || false);
      //   setIsLoading(false);
      // };
      // fetchShop();
      // For now, if no initialShopData, we'll rely on the "Not Found" state
    } else {
      setShop(initialShopData);
      // setIsFavorited(initialShopData?.isFavorited || false); // If isFavorited comes from data
      setIsLoading(false);
    }
  }, [initialShopData, router.params?.shopId]);


  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // Add logic to persist favorite state (e.g., API call, local storage)
    if (shop) {
      console.log(`Shop ${shop.id} favorite status: ${!isFavorited}`);
    }
  };

  const handleOpenLink = (url?: string) => {
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      });
    }
  };
  
  const getShopStatus = useCallback(() => {
    // Basic logic, can be expanded with shop.openingHours and current time
    if (!shop) return { text: 'N/A', color: ShopColors.textSecondary, isOpen: false };
    if (shop.isOpen === undefined) return { text: 'Hours not available', color: ShopColors.textSecondary, isOpen: false }; // Default if not provided
    return shop.isOpen
      ? { text: 'Open', color: ShopColors.success, isOpen: true }
      : { text: 'Closed', color: ShopColors.error, isOpen: false };
  }, [shop]);

  const shopStatus = getShopStatus();

  // --- Tab Scenes ---
  const MenuTab = () => (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      {shop?.menu && shop.menu.length > 0 ? (
        shop.menu.map((item, idx) => (
          <ProductMenuCard key={`${item.item}-${idx}`} item={item} onPress={(menuItem) => console.log('View item:', menuItem.item)} />
        ))
      ) : (
        <View style={styles.emptyTabContent}>
          <Ionicons name="receipt-outline" size={48} color={ShopColors.textSecondary} />
          <Text style={styles.emptyTabText}>No menu or services listed yet.</Text>
        </View>
      )}
    </ScrollView>
  );

  const InfoTab = () => (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      <Text style={styles.sectionTitle}>About {shop?.name}</Text>
      <Text style={styles.descriptionText}>{shop?.description || 'No description available.'}</Text>

      <Text style={styles.sectionTitle}>Location</Text>
      <TouchableOpacity onPress={() => shop?.mapLocation && handleOpenLink(`http://maps.google.com/?q=${shop.mapLocation.latitude},${shop.mapLocation.longitude}`)}>
        <Text style={styles.infoTextClickable}>{shop?.location || 'Location not specified.'}</Text>
      </TouchableOpacity>
      {/* Consider adding a small static map image here */}

      <Text style={styles.sectionTitle}>Contact</Text>
      {shop?.contact && <TouchableOpacity onPress={() => handleOpenLink(`tel:${shop.contact}`)}><Text style={styles.infoTextClickable}>Call: {shop.contact}</Text></TouchableOpacity>}
      {shop?.website && <TouchableOpacity onPress={() => handleOpenLink(shop.website)}><Text style={styles.infoTextClickable}>Website: {shop.website}</Text></TouchableOpacity>}
      {/* Add social media links here from shop.socialLinks */}


      <Text style={styles.sectionTitle}>Business Hours</Text>
      <Text style={styles.infoText}>{shop?.openingHours || 'Hours not specified.'}</Text>
      {/* You might want to parse and display shop.openingHours more elegantly */}

      {/* {shop?.amenities && shop.amenities.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Amenities</Text>
          {shop.amenities.map(amenity => <Text key={amenity} style={styles.infoText}>• {amenity}</Text>)}
        </>
      )} */}
    </ScrollView>
  );

  const ReviewsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      {shop?.reviews && shop.reviews.length > 0 ? (
        shop.reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))
      ) : (
        <View style={styles.emptyTabContent}>
          <Ionicons name="chatbubbles-outline" size={48} color={ShopColors.textSecondary} />
          <Text style={styles.emptyTabText}>No reviews yet. Be the first!</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    menu: MenuTab,
    info: InfoTab,
    reviews: ReviewsTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: ShopColors.accent }}
      style={{ backgroundColor: ShopColors.cardBackground }}
      labelStyle={{ color: ShopColors.textPrimary, fontFamily: 'Poppins-Medium', fontSize: 13, textTransform: 'capitalize' }}
      activeColor={ShopColors.accent}
      inactiveColor={ShopColors.textSecondary}
      scrollEnabled
      tabStyle={styles.tabStyle}
    />
  );
  // --- End Tab Scenes ---

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeAreaLoading} edges={['top']}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => router.back()} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={24} color={ShopColors.primary} />
            </TouchableOpacity>
          </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ShopColors.accent} />
          <Text style={styles.loadingText}>Loading Shop Details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!shop) {
    return (
      <SafeAreaView style={styles.safeAreaLoading} edges={['top']}>
         <View style={styles.headerActions}>
            <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => router.back()} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={24} color={ShopColors.primary} />
            </TouchableOpacity>
          </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="storefront-outline" size={60} color={ShopColors.textSecondary} />
          <Text style={styles.notFoundTitle}>Shop Not Found</Text>
          <Text style={styles.notFoundText}>The shop you are looking for does not exist or could not be loaded.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: shop.image }} style={styles.heroImage} resizeMode="cover" />
          {/* Status Overlay if closed */}
          {!shopStatus.isOpen && (
            <View style={styles.statusOverlay}>
              <Text style={styles.statusOverlayText}>CLOSED</Text>
            </View>
          )}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButtonAbsolute} onPress={handleFavoriteToggle}>
              <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={24} color={isFavorited ? ShopColors.error : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sticky Header for Shop Info (Optional, can be part of ScrollView) */}
        <View style={styles.shopInfoContainer}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopCategoryText}>{shop.category}</Text>
            <View style={styles.ratingStatusRow}>
                <Ionicons name="star" size={16} color={ShopColors.warning} style={{marginRight: 4}}/>
                <Text style={styles.ratingText}>{shop.rating.toFixed(1)}</Text>
                <Text style={styles.reviewsCountText}>({shop.ratingCount || 0} reviews)</Text>
                <Text style={[styles.shopStatusText, { color: shopStatus.color }]}>• {shopStatus.text}</Text>
            </View>
        </View>

        {/* Tab View for Content */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
          style={styles.tabViewStyle} // Ensures TabView takes up appropriate height
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ShopColors.background },
  safeAreaLoading: { flex: 1, backgroundColor: ShopColors.background },
  heroSection: { height: 250, backgroundColor: ShopColors.border },
  heroImage: { width: '100%', height: '100%' },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOverlayText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    letterSpacing: 2,
  },
  headerActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20, // Adjust for status bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButtonAbsolute: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButtonAbsolute: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  shopInfoContainer: { // This is the part that can be sticky
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: ShopColors.cardBackground, // To make it stand out if sticky
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  shopName: { fontSize: 24, fontFamily: 'Poppins-Bold', color: ShopColors.textPrimary, marginBottom: 4 },
  shopCategoryText: { fontSize: 15, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, marginBottom: 8 },
  ratingStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: ShopColors.textPrimary, marginRight: 4 },
  reviewsCountText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary },
  shopStatusText: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginLeft: 8 },

  tabViewStyle: {
    minHeight: Dimensions.get('window').height - 100, // Adjust as needed to ensure content is scrollable
  },
  tabStyle: {
      width: 'auto', // Allow tabs to size based on content
      paddingHorizontal: 16, // Add some padding to tab items
  },
  tabContentContainer: { padding: 20, backgroundColor: ShopColors.background },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: ShopColors.textPrimary, marginTop: 16, marginBottom: 10 },
  descriptionText: { fontSize: 15, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, lineHeight: 22, marginBottom: 16 },
  infoText: { fontSize: 15, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, marginBottom: 8, lineHeight: 22 },
  infoTextClickable: { fontSize: 15, fontFamily: 'Poppins-Regular', color: ShopColors.accent, marginBottom: 8, lineHeight: 22, textDecorationLine: 'underline' },

  // Product/Menu Card Mock Styles
  productCard: {
    backgroundColor: ShopColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: ShopColors.textPrimary, marginBottom: 4 },
  productPrice: { fontSize: 15, fontFamily: 'Poppins-Medium', color: ShopColors.accent, marginBottom: 6 },
  productDescription: { fontSize: 13, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary },

  // Review Card Mock Styles
  reviewCard: {
    backgroundColor: ShopColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewUserName: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: ShopColors.textPrimary },
  reviewRating: { flexDirection: 'row', alignItems: 'center' },
  reviewRatingText: { fontSize: 14, fontFamily: 'Poppins-Medium', color: ShopColors.textPrimary, marginLeft: 4 },
  reviewComment: { fontSize: 14, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, marginBottom: 8, lineHeight: 20 },
  reviewDate: { fontSize: 12, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, textAlign: 'right' },
  
  emptyTabContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  emptyTabText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, marginTop: 12, textAlign: 'center' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: ShopColors.background },
  loadingText: { marginTop: 12, fontSize: 16, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary },
  notFoundTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: ShopColors.textPrimary, marginBottom: 12, textAlign: 'center' },
  notFoundText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: ShopColors.textSecondary, textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  goBackButton: { backgroundColor: ShopColors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  goBackButtonText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
});

export default ShopDetail;
