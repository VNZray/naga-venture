import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
// STEP 1: Comment out the LinearGradient import for this test
// import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ShopCardProps } from './types';

const FeaturedShopCard: React.FC<ShopCardProps> = ({ shop, onPress }) => {
  const cardWidth = 280;
  const cardHeight = 180;

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      height: cardHeight,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: ShopColors.border, // Fallback color if image fails
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    imageBackground: {
      flex: 1,
      position: 'relative',
      justifyContent: 'flex-end',
    },
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    // This was the original style for the LinearGradient
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '70%',
      zIndex: 1,
    },
    // STEP 2: Define a fallback style for the View that replaces LinearGradient
    gradientFallback: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '70%', // Mimics the original gradient's coverage
      zIndex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)', // Solid color to simulate the dark part of the gradient
    },
    contentContainer: {
      padding: 16,
      position: 'relative',
      zIndex: 2, // Ensure content is above the fallback gradient view
    },
    name: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    ratingBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      zIndex: 3, // Above gradient and content
    },
    ratingText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Poppins-SemiBold',
      marginLeft: 4,
    },
    featuredTag: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: ShopColors.accent,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      zIndex: 3, // Above gradient and content
    },
    featuredTagText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontFamily: 'Poppins-SemiBold',
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(shop.id)}
      activeOpacity={0.9}
    >
      <View style={styles.imageBackground}>
        <Image
          source={{ uri: shop.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          placeholder="LKN]Rv%2Tw=w]~RBVZRi};RPxuwH"
        />
        {/* STEP 3: Replace the LinearGradient component with a simple View using the fallback style */}
        <View style={styles.gradientFallback} />
        {/*
        // The original LinearGradient - keep this commented out for this test:
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        */}
        <View style={styles.contentContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {shop.name}
          </Text>
        </View>
        {shop.rating !== undefined && shop.rating !== null && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{shop.rating.toFixed(1)}</Text>
          </View>
        )}
        <View style={styles.featuredTag}>
          <Text style={styles.featuredTagText}>FEATURED</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedShopCard;
