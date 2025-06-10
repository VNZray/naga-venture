// filepath: components/TourismCMS/organisms/CMSRouteGuard.tsx
import { useAuth } from '@/context/AuthContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { CMSButton, CMSText } from '../atoms';

interface CMSRouteGuardProps {
  routePath: string;
  children: React.ReactNode;
}

/**
 * CMS Route Guard Organism
 *
 * A route protection component specific to the Tourism CMS.
 * Handles authentication and authorization for CMS routes.
 * Following Atomic Design principles as an organism (complex component with multiple molecules/atoms).
 *
 * @param routePath - The current route path for authorization checking
 * @param children - The content to render if authorized
 */
const CMSRouteGuard: React.FC<CMSRouteGuardProps> = ({
  routePath,
  children,
}) => {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const { hasAccess, isLoading: routeLoading } = useRouteGuard(routePath);

  const isLoading = authLoading || routeLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <CMSText type="body" darkColor="#666" style={styles.loadingText}>
          Loading...
        </CMSText>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome
          name="lock"
          size={48}
          color="#FF3B30"
          style={styles.errorIcon}
        />
        <CMSText type="title" darkColor="#000" style={styles.errorTitle}>
          Authentication Required
        </CMSText>
        <CMSText type="body" darkColor="#666" style={styles.errorMessage}>
          Please sign in to access the Tourism CMS
        </CMSText>
        <CMSButton
          title="Go to Login"
          variant="primary"
          onPress={() => router.push('/TourismCMS/login')}
          style={styles.actionButton}
        />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome
          name="ban"
          size={48}
          color="#FF9500"
          style={styles.errorIcon}
        />
        <CMSText type="title" darkColor="#000" style={styles.errorTitle}>
          Access Denied
        </CMSText>
        <CMSText type="body" darkColor="#666" style={styles.errorMessage}>
          You don&apos;t have permission to access this page.
        </CMSText>
        <CMSText type="caption" darkColor="#999" style={styles.roleInfo}>
          Current role: {userProfile?.role || 'No role assigned'}
        </CMSText>
        <CMSButton
          title="Go to Dashboard"
          variant="secondary"
          onPress={() => router.push('/TourismCMS/(admin)/dashboard')}
          style={styles.actionButton}
        />
      </View>
    );
  }

  return <>{children}</>;
};

export default CMSRouteGuard;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 32,
  },
  errorIcon: {
    marginBottom: 24,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  roleInfo: {
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  actionButton: {
    minWidth: 200,
  },
});
