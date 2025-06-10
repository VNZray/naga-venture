import { CMSHeader, CMSSidebar } from '@/components/TourismCMS';
import { AccommodationProvider } from '@/context/AccommodationContext';
import { useAuth } from '@/context/AuthContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AdminLayout() {
  const [headerTitle, setHeaderTitle] = useState('Dashboard');
  const { user, userProfile, isLoading, isUserProfileLoading } = useAuth();

  useEffect(() => {
    // Wait until authentication status and profile are fully loaded
    if (!isLoading && !isUserProfileLoading) {
      if (!user) {
        // If user is not authenticated, redirect to CMS login
        router.replace('/TourismCMS/login');
      } else if (
        userProfile &&
        userProfile.role &&
        ![
          'tourism_admin',
          'business_listing_manager',
          'tourism_content_manager',
          'business_registration_manager',
        ].includes(userProfile.role)
      ) {
        // If user doesn't have a valid role, redirect to unauthorized
        router.replace('/TourismCMS/(admin)/unauthorized');
      }
    }
  }, [user, userProfile, isLoading, isUserProfileLoading]);

  // Show loading state while authentication is being determined
  if (isLoading || isUserProfileLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0A1B47" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect if user is not authenticated or profile is missing
  if (!user || !userProfile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0A1B47" />
        <Text style={styles.loadingText}>Loading User...</Text>
      </View>
    );
  }

  // Handle navigation updates from sidebar
  const handleNavigate = (path: string) => {
    // Extract page name from path for header title
    const pathSegments = path.split('/');
    const pageName = pathSegments[pathSegments.length - 1];
    const formattedTitle = pageName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setHeaderTitle(formattedTitle);
  };
  return (
    <AccommodationProvider>
      <NavigationProvider userRole={userProfile?.role}>
        <ThemeProvider value={DefaultTheme}>
          <View style={styles.container}>
            {/* New Hierarchical Sidebar */}
            <CMSSidebar
              userRole={userProfile?.role}
              onNavigate={handleNavigate}
            />

            {/* Main Content Area */}
            <View style={styles.content}>
              <CMSHeader
                title={headerTitle}
                userName={
                  userProfile
                    ? `${userProfile.first_name || ''} ${
                        userProfile.last_name || ''
                      }`.trim() || 'User'
                    : 'User'
                }
                userEmail={user?.email ?? ''}
              />
              <Stack
                screenOptions={{ headerShown: false, headerBackVisible: false }}
              />
            </View>
          </View>
        </ThemeProvider>
      </NavigationProvider>
    </AccommodationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0A1B47',
    fontWeight: '500',
  },
});
