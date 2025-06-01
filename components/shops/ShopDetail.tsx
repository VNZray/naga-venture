import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShopDetailProps {
  shop: ShopData | null;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop }) => {
  // Handle case where shop is not found
  if (!shop) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: ShopColors.background,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: ShopColors.border,
            backgroundColor: ShopColors.cardBackground,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16 }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={ShopColors.textPrimary}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Poppins-SemiBold',
              color: ShopColors.textPrimary,
            }}
          >
            Shop Not Found
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Poppins-SemiBold',
              color: ShopColors.textPrimary,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Shop Not Found
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
              color: ShopColors.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            The shop you are looking for does not exist.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: ShopColors.accent,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ShopColors.background,
    },
    heroSection: {
      position: 'relative',
      height: 250,
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: ShopColors.cardBackground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
      paddingTop: 20,
    },
    shopHeader: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: ShopColors.border,
    },
    shopName: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: ShopColors.textPrimary,
      marginBottom: 4,
    },
    shopCategory: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      textTransform: 'capitalize',
      marginBottom: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    ratingText: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      marginLeft: 6,
    },
    reviewsText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      marginLeft: 8,
    },
    descriptionSection: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: ShopColors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      lineHeight: 24,
    },
    contactSection: {
      padding: 20,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    contactText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textPrimary,
      marginLeft: 12,
      flex: 1,
    },
    contactLink: {
      color: ShopColors.accent,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Image
          source={{ uri: shop.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.shopHeader}>
          <Text style={styles.shopName}>{shop.name}</Text>
          {shop.category && (
            <Text style={styles.shopCategory}>{shop.category}</Text>
          )}

          {shop.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{shop.rating.toFixed(1)}</Text>
              {/* Corrected line: */}
              <Text style={styles.reviewsText}>
                ({shop.ratingCount || 0} reviews)
              </Text>
            </View>
          )}
        </View>
        {shop.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{shop.description}</Text>
          </View>
        )}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {shop.location && (
            <View style={styles.contactItem}>
              <Ionicons
                name="location-outline"
                size={20}
                color={ShopColors.iconPrimary}
              />
              <Text style={styles.contactText}>{shop.location}</Text>
            </View>
          )}

          {shop.contact && (
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons
                name="call-outline"
                size={20}
                color={ShopColors.iconPrimary}
              />
              <Text style={[styles.contactText, styles.contactLink]}>
                {shop.contact}
              </Text>
            </TouchableOpacity>
          )}

          {shop.website && (
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={ShopColors.iconPrimary}
              />
              <Text style={[styles.contactText, styles.contactLink]}>
                {shop.website}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopDetail;
