import { ShopColors } from '@/constants/ShopColors'; // Using ShopColors for consistency if needed
import { Image } from 'expo-image';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity, // If we add an optional title
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // If adding a gradient for text overlay

// Define props for the SpecialOfferCard
interface SpecialOfferCardProps {
  offer: {
    // Assuming 'offer' is an object with at least an ID and image URL
    id: string;
    promoImageUrl: string;
    title?: string; // Optional title
    altText?: string;
  };
  onPress: (offerId: string) => void; // Handler for when the card is pressed
}

const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({
  offer,
  onPress,
}) => {
  const cardWidth = 150;
  const cardHeight = 250;

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      height: cardHeight,
      borderRadius: 12, // Consistent rounding
      overflow: 'hidden', // Ensures image respects border radius
      backgroundColor: ShopColors.border, // Fallback background
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    // Optional: Styles for an overlay title
    titleOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      // For a gradient background:
      // backgroundColor: 'transparent', // Handled by LinearGradient
    },
    titleText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(offer.id)}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={
        offer.altText || offer.title || `Special offer ${offer.id}`
      }
      accessibilityRole="button"
    >
      <Image
        source={{ uri: offer.promoImageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**-oJ-pM|' }}
      />
      {/* Optional: Title Overlay - uncomment if you want a title on the image
      {offer.title && (
        // If using gradient:
        // <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.titleOverlay}>
        <View style={styles.titleOverlay}>
          <Text style={styles.titleText} numberOfLines={2}>{offer.title}</Text>
        </View>
        // </LinearGradient>
      )}
      */}
    </TouchableOpacity>
  );
};

export default SpecialOfferCard;
