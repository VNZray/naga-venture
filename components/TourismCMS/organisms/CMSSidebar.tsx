// filepath: components/TourismCMS/organisms/CMSSidebar.tsx
import { tourismAdminNavigation } from '@/constants/NavigationConfig';
import { useAuth } from '@/context/AuthContext';
import { NavigationItem, SidebarState } from '@/types/navigation';
import { UserRole } from '@/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { SignOut } from 'phosphor-react-native';
import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CMSText } from '../atoms';
import { CMSNavigationSection } from '../molecules';

interface CMSSidebarProps {
  userRole?: UserRole;
  isVisible?: boolean;
  onNavigate?: (path: string) => void;
}

const STORAGE_KEY = '@TourismCMS:SidebarState';
const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = Platform.select({
  web: 260, // Reduced from 280
  default: Math.min(260, screenWidth * 0.8), // Reduced from 280
});

/**
 * CMSSidebar - Organism Component
 *
 * Main hierarchical sidebar navigation for Tourism CMS.
 * Features:
 * - Role-based navigation filtering
 * - Persistent expand/collapse state
 * - Active route highlighting
 * - Smooth animations
 * - Responsive design
 *
 * @param userRole - Current user's role for permission filtering
 * @param isVisible - Whether sidebar is visible (mobile responsive)
 * @param onNavigate - Custom navigation handler
 */
export const CMSSidebar: React.FC<CMSSidebarProps> = ({
  userRole,
  isVisible = true,
  onNavigate,
}) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarState, setSidebarState] = React.useState<SidebarState>({
    expandedSections: [],
    activeSection: '',
    userRole,
  });

  // Filter navigation items based on user role
  const filteredNavigation = React.useMemo(() => {
    if (!userRole) return [];

    const filterByPermissions = (items: NavigationItem[]): NavigationItem[] => {
      return items
        .filter((item) => item.permissions.includes(userRole))
        .map((item) => ({
          ...item,
          subsections: item.subsections
            ? filterByPermissions(item.subsections)
            : undefined,
        }))
        .filter((item) => !item.subsections || item.subsections.length > 0);
    };

    return filterByPermissions(tourismAdminNavigation);
  }, [userRole]);

  // Find active section and subsection based on current path
  const findActiveSection = React.useCallback(
    (
      items: NavigationItem[],
      path: string
    ): { section: string; subsection?: string } => {
      for (const item of items) {
        if (item.path === path) {
          return { section: item.id };
        }

        if (item.subsections) {
          const found = findActiveSection(item.subsections, path);
          if (found.section) {
            return { section: item.id, subsection: found.section };
          }
        }
      }
      return { section: '' };
    },
    []
  );

  // Load persisted sidebar state
  React.useEffect(() => {
    const loadSidebarState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState: SidebarState = JSON.parse(stored);
          setSidebarState((prev) => ({
            ...prev,
            expandedSections: parsedState.expandedSections || [],
          }));
        }
      } catch (error) {
        console.warn('Failed to load sidebar state:', error);
      }
    };

    loadSidebarState();
  }, []);

  // Update active section based on current route
  React.useEffect(() => {
    const { section, subsection } = findActiveSection(
      filteredNavigation,
      pathname
    );
    setSidebarState((prev) => ({
      ...prev,
      activeSection: subsection || section,
    }));

    // Auto-expand section containing active route
    if (section && !sidebarState.expandedSections.includes(section)) {
      setSidebarState((prev) => ({
        ...prev,
        expandedSections: [...prev.expandedSections, section],
      }));
    }
  }, [
    pathname,
    filteredNavigation,
    findActiveSection,
    sidebarState.expandedSections,
  ]);

  // Persist sidebar state
  const persistSidebarState = React.useCallback(async (state: SidebarState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist sidebar state:', error);
    }
  }, []);

  // Handle section expand/collapse
  const handleToggleExpand = React.useCallback(
    (sectionId: string) => {
      setSidebarState((prev) => {
        const isExpanded = prev.expandedSections.includes(sectionId);
        const newExpandedSections = isExpanded
          ? prev.expandedSections.filter((id) => id !== sectionId)
          : [...prev.expandedSections, sectionId];

        const newState = {
          ...prev,
          expandedSections: newExpandedSections,
        };

        persistSidebarState(newState);
        return newState;
      });
    },
    [persistSidebarState]
  );
  // Handle navigation
  const handleNavigate = React.useCallback(
    (path: string) => {
      if (onNavigate) {
        onNavigate(path);
      } else {
        router.push(path as any);
      }
    },
    [router, onNavigate]
  ); // Handle sign out
  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
      router.replace('/TourismCMS/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [signOut, router]);
  const renderHeader = () => (
    <View
      style={[styles.header, { borderBottomColor: 'rgba(255, 255, 255, 0.1)' }]}
    >
      <CMSText type="title" style={[styles.headerTitle, { color: '#FFFFFF' }]}>
        Tourism CMS
      </CMSText>
      {userRole && (
        <CMSText
          type="caption"
          style={[styles.headerSubtitle, { color: 'rgba(255, 255, 255, 0.7)' }]}
        >
          {userRole.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </CMSText>
      )}
    </View>
  );
  const renderNavigation = () => (
    <ScrollView
      style={styles.navigationContainer}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {' '}
      {filteredNavigation.map((section, index) => {
        const isExpanded = sidebarState.expandedSections.includes(section.id);
        const isActive =
          sidebarState.activeSection === section.id ||
          (section.subsections &&
            section.subsections.some(
              (sub) => sidebarState.activeSection === sub.id
            ));

        return (
          <React.Fragment key={section.id}>
            {/* Add separator line before each section (except the first one) */}
            {index > 0 && <View style={styles.sectionSeparator} />}

            <CMSNavigationSection
              section={section}
              isExpanded={isExpanded}
              isActive={isActive}
              activeSubsection={sidebarState.activeSection}
              onToggleExpand={handleToggleExpand}
              onNavigate={handleNavigate}
            />
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
  const renderSignOutButton = () => (
    <View style={styles.signOutContainer}>
      <TouchableOpacity
        style={[
          styles.signOutButton,
          { borderTopColor: 'rgba(255, 255, 255, 0.1)' },
        ]}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        {' '}
        <SignOut
          size={18} // Reduced size
          color="#FF6B6B" // Red color for sign out
          weight="bold"
          style={styles.signOutIcon}
        />
        <CMSText type="body" style={[styles.signOutText, { color: '#FF6B6B' }]}>
          Sign Out
        </CMSText>
      </TouchableOpacity>
    </View>
  );

  if (!isVisible) {
    return null;
  }
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: '#0A1B47', // Primary color background
          borderRightColor: 'rgba(255, 255, 255, 0.1)', // Subtle white border
          width: SIDEBAR_WIDTH,
        },
      ]}
    >
      {renderHeader()}
      {renderNavigation()}
      {renderSignOutButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRightWidth: 1,
    ...Platform.select({
      web: {
        position: 'fixed' as any,
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      },
    }),
  },
  header: {
    padding: 16, // Reduced from 20
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: 2, // Reduced from 4
    fontSize: 16, // Slightly smaller
  },
  headerSubtitle: {
    fontSize: 11, // Reduced from 12
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  navigationContainer: {
    flex: 1,
    paddingVertical: 4, // Reduced from 8
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle separator line
    marginVertical: 8, // Space around the separator
    marginHorizontal: 12, // Inset from sides
  },
  signOutContainer: {
    padding: 12, // Reduced from 16
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Reduced from 12
    paddingHorizontal: 12, // Reduced from 16
    borderTopWidth: 1,
    borderRadius: 6, // Reduced from 8
    backgroundColor: 'rgba(255, 107, 107, 0.1)', // Subtle red background
  },
  signOutIcon: {
    marginRight: 8, // Reduced from 12
  },
  signOutText: {
    fontSize: 13, // Reduced from 15
    fontWeight: '500',
  },
});
