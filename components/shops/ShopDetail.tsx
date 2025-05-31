import { useColorScheme } from '@/hooks/useColorScheme';
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
    View
} from 'react-native';

interface ShopDetailProps {
  shop: ShopData | null;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ shop }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Beautiful color scheme matching the enhanced design
  const colors = {
    textColor: isDark ? '#ffffff' : '#1A1A1A',
    subtextColor: isDark ? '#94A3B8' : '#6B7280',
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    cardBackground: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#475569' : '#E5E7EB',
    accentColor: '#3B82F6',
    ratingColor: '#F59E0B',
    iconColor: isDark ? '#94A3B8' : '#6B7280',
  };

  // Handle case where shop is not found
  if (!shop) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
          backgroundColor: colors.cardBackground,
        }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.textColor} />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontFamily: 'Poppins-SemiBold',
            color: colors.textColor,
          }}>
            Shop Not Found
          </Text>
        </View>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontFamily: 'Poppins-SemiBold',
            color: colors.textColor,
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Shop Not Found
          </Text>          <Text style={{
            fontSize: 16,
            fontFamily: 'Poppins-Regular',
            color: colors.subtextColor,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            The shop you are looking for does not exist or has been removed.
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.accentColor,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ 
              color: '#FFFFFF', 
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
            }}>
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
      backgroundColor: colors.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      backgroundColor: colors.cardBackground,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    backButton: {
      marginRight: 16,
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
    },
    imageContainer: {
      position: 'relative',
    },    image: {
      width: '100%',
      height: 280,
    },
    content: {
      padding: 20,
      backgroundColor: colors.cardBackground,
    },
    name: {
      fontSize: 28,
      fontFamily: 'Poppins-Bold',
      color: colors.textColor,
      marginBottom: 8,
      lineHeight: 34,
    },
    category: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: colors.subtextColor,
      textTransform: 'capitalize',
      marginBottom: 12,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundColor,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    ratingStars: {
      flexDirection: 'row',
      marginRight: 8,
    },
    rating: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
      marginLeft: 4,
    },
    ratingCount: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
      marginLeft: 4,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
      marginBottom: 32,
    },
    infoSection: {
      backgroundColor: colors.backgroundColor,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    infoTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 4,
    },
    infoIconContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      padding: 8,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.textColor,
      flex: 1,
      lineHeight: 20,
    },
  });

  const handleBack = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={colors.textColor} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: shop.image }} style={styles.image} resizeMode="cover" />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name}>{shop.name}</Text>
          <Text style={styles.category}>{shop.category}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, index) => (
                <Ionicons 
                  key={index}
                  name={index < Math.floor(shop.rating) ? "star" : "star-outline"} 
                  size={16} 
                  color={colors.ratingColor} 
                />
              ))}
            </View>
            <Text style={styles.rating}>{shop.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({shop.ratingCount} reviews)</Text>
          </View>

          <Text style={styles.description}>{shop.description}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Shop Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="location" 
                  size={16} 
                  color={colors.accentColor} 
                />
              </View>
              <Text style={styles.infoText}>{shop.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="call" 
                  size={16} 
                  color={colors.accentColor} 
                />
              </View>
              <Text style={styles.infoText}>{shop.contact}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="time" 
                  size={16} 
                  color={colors.accentColor} 
                />
              </View>
              <Text style={styles.infoText}>{shop.openingHours}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="card" 
                  size={16} 
                  color={colors.accentColor} 
                />
              </View>
              <Text style={styles.infoText}>{shop.priceRange}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopDetail;
