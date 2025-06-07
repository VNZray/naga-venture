import { ErrorState } from '@/components/shops/ErrorState';
import { ShopColors } from '@/constants/ShopColors';
import { useSpecialOffer } from '@/hooks/useShops';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SpecialOfferDetailsPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: offer,
    isLoading,
    isError,
    refetch,
  } = useSpecialOffer(id || '');

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ShopColors.accent} />
      </View>
    );
  }

  if (isError || !offer) {
    return (
      <ErrorState
        message={
          isError
            ? 'Could not load special offer. Please try again.'
            : 'Special offer not found.'
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: offer.title }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {offer.image && (
          <Image source={{ uri: offer.image }} style={styles.offerImage} />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{offer.title}</Text>
          <View style={styles.infoSection}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={ShopColors.textSecondary}
            />
            <Text style={styles.validityText}>
              Valid from {new Date(offer.validFrom).toLocaleDateString()} to
              {new Date(offer.validUntil).toLocaleDateString()}
            </Text>
          </View>

          {offer.discountPercent && (
            <View style={styles.infoSection}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={ShopColors.accent}
              />
              <Text style={styles.discountText}>
                {offer.discountPercent}% OFF
              </Text>
            </View>
          )}
          {offer.discountFixedAmount && (
            <View style={styles.infoSection}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={ShopColors.accent}
              />
              <Text style={styles.discountText}>
                ₱{offer.discountFixedAmount} OFF
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{offer.description}</Text>

          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <Text style={styles.terms}>{offer.termsAndConditions}</Text>

          {offer.shopId && (
            <Text style={styles.shopLink}>
              Offer applicable at Shop ID: {offer.shopId}
            </Text>
          )}
          {offer.applicableShopIds && offer.applicableShopIds.length > 0 && (
            <Text style={styles.shopLink}>
              Applicable at shops: {offer.applicableShopIds.join(', ')}
            </Text>
          )}
          {offer.applicableToAllShops && (
            <Text style={styles.shopLink}>
              This offer is applicable to all participating shops.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ShopColors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  offerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
    marginBottom: 12,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  validityText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  discountText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.accent,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 24,
  },
  terms: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary, // Changed from textMuted
    lineHeight: 20,
    fontStyle: 'italic',
  },
  shopLink: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textAccent,
    marginTop: 16,
  },
});

export default SpecialOfferDetailsPage;
