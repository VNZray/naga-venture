// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\ui\RouteGuard.tsx
import { useRouteGuard } from '@/hooks/useRouteGuard';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface RouteGuardProps {
  children: React.ReactNode;
  routePath: string;
  fallback?: React.ReactNode;
}

/**
 * Route Guard Component (Organism)
 * Protects routes by checking user permissions before rendering children
 * Follows Atomic Design principles and SOLID principles
 */
export function RouteGuard({ children, routePath, fallback }: RouteGuardProps) {
  const { isLoading, hasAccess } = useRouteGuard(routePath);

  // Show loading state
  if (isLoading) {
    return fallback || <RouteGuardLoadingState />;
  }

  // If user doesn't have access, the hook will handle redirection
  // This is a fallback in case redirection fails
  if (!hasAccess) {
    return fallback || <RouteGuardUnauthorizedState />;
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Loading State Component (Molecule)
 */
function RouteGuardLoadingState() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#0A1B47" />
      <Text style={styles.loadingText}>Verifying permissions...</Text>
    </View>
  );
}

/**
 * Unauthorized State Component (Molecule)
 */
function RouteGuardUnauthorizedState() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.unauthorizedText}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0A1B47',
    fontWeight: '500',
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default RouteGuard;
