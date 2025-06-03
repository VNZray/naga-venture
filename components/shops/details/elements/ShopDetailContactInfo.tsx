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

  const getSocialColor = (platform: keyof ShopSocialLinks) => {
    switch (platform) {
      case 'facebook': return '#1877F2';
      case 'instagram': return '#E4405F';
      case 'twitter': return '#1DA1F2';
      case 'tiktok': return '#000000';
      case 'website': return ShopColors.accent;
      default: return ShopColors.textSecondary;
    }
  };

  const getSocialLabel = (platform: keyof ShopSocialLinks) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <View style={styles.container}>
      {/* Contact Items */}
      {location && (
        <TouchableOpacity style={styles.contactItem} onPress={onDirectionsPress}>
          <Ionicons name="location" size={20} color={ShopColors.accent} />
          <Text style={styles.contactText}>{location}</Text>
          <Ionicons name="chevron-forward" size={16} color={ShopColors.textSecondary} />
        </TouchableOpacity>
      )}

      {contact && (
        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
          <Ionicons name="call" size={20} color={ShopColors.accent} />
          <Text style={styles.contactText}>{contact}</Text>
          <Ionicons name="chevron-forward" size={16} color={ShopColors.textSecondary} />
        </TouchableOpacity>
      )}

      {email && (
        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
          <Ionicons name="mail" size={20} color={ShopColors.accent} />
          <Text style={styles.contactText}>{email}</Text>
          <Ionicons name="chevron-forward" size={16} color={ShopColors.textSecondary} />
        </TouchableOpacity>
      )}

      {/* Social Links */}
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <View style={styles.socialSection}>
          <Text style={styles.socialSectionTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            {Object.entries(socialLinks).map(([platform, url]) => {
              if (!url) return null;
              
              const platformKey = platform as keyof ShopSocialLinks;
              
              return (
                <TouchableOpacity 
                  key={platform}
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(url, platform)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={getSocialIcon(platformKey) as any} 
                    size={24} 
                    color={getSocialColor(platformKey)} 
                  />
                  <Text style={styles.socialButtonText}>
                    {getSocialLabel(platformKey)}
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
    paddingBottom: 8,
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
  socialSection: {
    paddingTop: 16,
  },
  socialSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    flexWrap: 'wrap',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ShopColors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ShopColors.border,
    gap: 8,
    minWidth: 100,
    elevation: 1,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  socialButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
  },
});

export default React.memo(ShopDetailContactInfo);