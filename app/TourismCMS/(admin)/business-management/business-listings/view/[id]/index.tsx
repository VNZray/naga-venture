// filepath: app/TourismCMS/(admin)/business-management/business-listings/view/[id]/index.tsx
import { useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  At,
  FacebookLogo,
  Globe,
  InstagramLogo,
  MapPin,
  Phone,
  TwitterLogo,
} from 'phosphor-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks and types
import { useBusiness } from '@/hooks/useBusinessManagement';

// Services
import { NavigationService } from '@/services/NavigationService';

// Components
import { CMSButton } from '@/components/TourismCMS/atoms';
import { StatusBadge } from '@/components/TourismCMS/molecules';
import { CMSRouteGuard } from '@/components/TourismCMS/organisms';

/**
 * View Business Page
 *
 * Read-only detailed view of a business listing with edit action.
 */
export default function ViewBusinessScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Fetch business data
  const { data: business, isLoading, isError, error } = useBusiness(id);

  const handleEditBusiness = () => {
    if (!id) return;
    NavigationService.toEditBusiness(id);
  };

  const handleGoBack = () => {
    NavigationService.toAllBusinesses();
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error('Failed to open URL:', err);
      });
    }
  };

  if (!id) {
    return (
      <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/view">
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Invalid Business ID</Text>
            <Text style={styles.errorMessage}>
              No business ID provided. Please select a valid business to view.
            </Text>
            <CMSButton
              title="Go Back"
              onPress={handleGoBack}
              variant="primary"
              style={styles.backButton}
            />
          </View>
        </SafeAreaView>
      </CMSRouteGuard>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/view">
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading business details...</Text>
          </View>
        </SafeAreaView>
      </CMSRouteGuard>
    );
  }

  // Error state
  if (isError || !business) {
    return (
      <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/view">
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Business Not Found</Text>
            <Text style={styles.errorMessage}>
              {error?.message || 'The requested business could not be found.'}
            </Text>
            <CMSButton
              title="Go Back"
              onPress={handleGoBack}
              variant="primary"
              style={styles.backButton}
            />
          </View>
        </SafeAreaView>
      </CMSRouteGuard>
    );
  }

  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/view">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color="#374151" weight="bold" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Business Details</Text>
            <Text style={styles.headerSubtitle}>
              View and manage business information
            </Text>{' '}
          </View>
          <CMSButton
            title="Edit"
            onPress={handleEditBusiness}
            variant="primary"
            size="small"
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.card}>
              <View style={styles.businessHeader}>
                <View style={styles.businessInfo}>
                  <Text style={styles.businessName}>
                    {business.business_name}
                  </Text>{' '}
                  <Text style={styles.businessType}>
                    {business.business_type?.replaceAll('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <StatusBadge status={business.status} size="medium" />
              </View>

              {business.description && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{business.description}</Text>
                </View>
              )}

              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  Created: {new Date(business.created_at).toLocaleDateString()}
                </Text>{' '}
                {business.review_count > 0 && (
                  <Text style={styles.metaText}>
                    Reviews: {business.review_count} • Rating:{' '}
                    {business.average_rating?.toFixed(1) || 'N/A'}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Location Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <View style={styles.card}>
              <View style={styles.infoItem}>
                <View style={styles.infoLabelRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.infoLabel}>Address</Text>
                </View>
                <Text style={styles.infoValue}>{business.address}</Text>
                <Text style={styles.infoValue}>
                  {business.city}, {business.province}
                  {business.postal_code && ` ${business.postal_code}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.card}>
              {business.phone && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handleOpenLink(`tel:${business.phone}`)}
                >
                  <View style={styles.infoLabelRow}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Phone</Text>
                  </View>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    {business.phone}
                  </Text>
                </TouchableOpacity>
              )}

              {business.email && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handleOpenLink(`mailto:${business.email}`)}
                >
                  <View style={styles.infoLabelRow}>
                    <At size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Email</Text>
                  </View>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    {business.email}
                  </Text>
                </TouchableOpacity>
              )}

              {business.website && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handleOpenLink(business.website!)}
                >
                  <View style={styles.infoLabelRow}>
                    <Globe size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Website</Text>
                  </View>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    {business.website}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Social Media */}
          {(business.facebook_url ||
            business.instagram_url ||
            business.twitter_url) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Social Media</Text>

              <View style={styles.card}>
                {business.facebook_url && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => handleOpenLink(business.facebook_url!)}
                  >
                    <View style={styles.infoLabelRow}>
                      <FacebookLogo size={16} color="#1877F2" />
                      <Text style={styles.infoLabel}>Facebook</Text>
                    </View>
                    <Text style={[styles.infoValue, styles.linkText]}>
                      {business.facebook_url}
                    </Text>
                  </TouchableOpacity>
                )}

                {business.instagram_url && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => handleOpenLink(business.instagram_url!)}
                  >
                    <View style={styles.infoLabelRow}>
                      <InstagramLogo size={16} color="#E4405F" />
                      <Text style={styles.infoLabel}>Instagram</Text>
                    </View>
                    <Text style={[styles.infoValue, styles.linkText]}>
                      {business.instagram_url}
                    </Text>
                  </TouchableOpacity>
                )}

                {business.twitter_url && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => handleOpenLink(business.twitter_url!)}
                  >
                    <View style={styles.infoLabelRow}>
                      <TwitterLogo size={16} color="#1DA1F2" />
                      <Text style={styles.infoLabel}>Twitter</Text>
                    </View>
                    <Text style={[styles.infoValue, styles.linkText]}>
                      {business.twitter_url}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Owner Information */}
          {business.profiles && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Owner</Text>

              <View style={styles.card}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>
                    {`${business.profiles.first_name || ''} ${
                      business.profiles.last_name || ''
                    }`.trim() || 'N/A'}
                  </Text>
                </View>

                {business.profiles.email && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>
                      {business.profiles.email}
                    </Text>
                  </View>
                )}

                {business.profiles.phone_number && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>
                      {business.profiles.phone_number}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </CMSRouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  businessInfo: {
    flex: 1,
    marginRight: 12,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  businessType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  linkText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  metaInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactItem: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
