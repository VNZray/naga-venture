import { ShopColors } from '@/constants/ShopColors';
import type { ShopSocialLinks } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';

interface ShopDetailContactInfoProps {
  location?: string;
  contact?: string;
  email?: string;
  socialLinks?: ShopSocialLinks;
  onDirectionsPress?: () => void;
}

const ShopDetailContactInfo: React.FC<ShopDetailContactInfoProps> = ({
  location,
  contact,
  email,
  socialLinks,
  onDirectionsPress
}) => {
  const handleCall = async () => {
    if (!contact) return;
    
    try {
      const phoneNumber = contact.replace(/[^0-9+]/g, '');
      await Linking.openURL(`tel:${phoneNumber}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to make call');
    }
  };

  const handleEmail = async () => {
    if (!email) return;
    
    try {
      await Linking.openURL(`mailto:${email}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to open email client');
    }
  };

  const handleSocialPress = async (url: string, platform: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', `Unable to open ${platform}`);
    }
  };

  const getSocialIcon = (platform: keyof ShopSocialLinks) => {
    switch (platform) {
      case 'facebook': return 'logo-facebook';
      case 'instagram': return 'logo-instagram';
      case 'twitter': return 'logo-twitter';
      case 'tiktok': return 'logo-tiktok';
      case 'website': return 'globe';
      default: return 'link';
    }
  };

  return (
    <View style={styles.container}>
      {/* Contact Items - Clean rows */}
      {location && (
        <TouchableOpacity style={styles.contactRow} onPress={onDirectionsPress}>
          <Ionicons name="location-outline" size={18} color={ShopColors.textSecondary} />
          <Text style={styles.contactText}>{location}</Text>
          <Ionicons name="chevron-forward" size={16} color={ShopColors.textSecondary} />
        </TouchableOpacity>
      )}

      {contact && (
        <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
          <Ionicons name="call-outline" size={18} color={ShopColors.textSecondary} />
          <Text style={styles.contactText}>{contact}</Text>
          <Ionicons name="chevron-forward" size={16} color={ShopColors.textSecondary} />
        </TouchableOpacity>
      )}

      {email && (
        <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
          <Ionicons name="mail-outline" size={18} color={ShopColors.textSecondary} />
          <Text style={styles.contactText}>{email}</Text>
          <Ionicons name="chevron-forward" size={16} color={ShopColors.textSecondary} />
        </TouchableOpacity>
      )}

      {/* Social Links - Minimal design */}
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow</Text>
          <View style={styles.socialLinks}>
            {Object.entries(socialLinks).map(([platform, url]) => {
              if (!url) return null;
              
              const platformKey = platform as keyof ShopSocialLinks;
              
              return (
                <TouchableOpacity 
                  key={platform}
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(url, platform)}
                >
                  <Ionicons 
                    name={getSocialIcon(platformKey) as any} 
                    size={20} 
                    color={ShopColors.accent} 
                  />
                  <Text style={styles.socialButtonText}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  
  // Clean contact rows
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
  },
  
  // Social section
  socialSection: {
    marginTop: 8,
  },
  socialTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ShopColors.border,
    gap: 6,
  },
  socialButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
  },
});

export default React.memo(ShopDetailContactInfo);