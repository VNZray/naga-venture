// filepath: hooks/useNavigation.ts
import { tourismAdminNavigation } from '@/constants/NavigationConfig';
import { NavigationItem, SidebarState } from '@/types/navigation';
import { UserRole } from '@/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@TourismCMS:SidebarState';

/**
 * Custom hook for managing sidebar navigation state
 *
 * Features:
 * - Persistent expand/collapse state
 * - Role-based navigation filtering
 * - Active route tracking
 * - Auto-expand for active sections
 *
 * @param userRole - Current user's role for permission filtering
 * @returns Navigation state and handlers
 */
export const useNavigation = (userRole?: UserRole) => {
  const pathname = usePathname();

  const [sidebarState, setSidebarState] = useState<SidebarState>({
    expandedSections: [],
    activeSection: '',
    userRole,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Filter navigation items based on user role
  const filteredNavigation = useCallback((): NavigationItem[] => {
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
  const findActiveSection = useCallback(
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
  const loadSidebarState = useCallback(async () => {
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist sidebar state
  const persistSidebarState = useCallback(async (state: SidebarState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist sidebar state:', error);
    }
  }, []);

  // Handle section expand/collapse
  const toggleExpand = useCallback(
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

  // Expand specific section
  const expandSection = useCallback(
    (sectionId: string) => {
      setSidebarState((prev) => {
        if (prev.expandedSections.includes(sectionId)) {
          return prev;
        }

        const newState = {
          ...prev,
          expandedSections: [...prev.expandedSections, sectionId],
        };

        persistSidebarState(newState);
        return newState;
      });
    },
    [persistSidebarState]
  );

  // Collapse specific section
  const collapseSection = useCallback(
    (sectionId: string) => {
      setSidebarState((prev) => {
        const newState = {
          ...prev,
          expandedSections: prev.expandedSections.filter(
            (id) => id !== sectionId
          ),
        };

        persistSidebarState(newState);
        return newState;
      });
    },
    [persistSidebarState]
  );

  // Collapse all sections
  const collapseAll = useCallback(() => {
    setSidebarState((prev) => {
      const newState = {
        ...prev,
        expandedSections: [],
      };

      persistSidebarState(newState);
      return newState;
    });
  }, [persistSidebarState]);

  // Check if section is expanded
  const isSectionExpanded = useCallback(
    (sectionId: string): boolean => {
      return sidebarState.expandedSections.includes(sectionId);
    },
    [sidebarState.expandedSections]
  );

  // Check if section is active
  const isSectionActive = useCallback(
    (sectionId: string): boolean => {
      return sidebarState.activeSection === sectionId;
    },
    [sidebarState.activeSection]
  );

  // Load state on mount
  useEffect(() => {
    loadSidebarState();
  }, [loadSidebarState]);

  // Update active section based on current route
  useEffect(() => {
    const navigation = filteredNavigation();
    const { section, subsection } = findActiveSection(navigation, pathname);

    setSidebarState((prev) => ({
      ...prev,
      activeSection: subsection || section,
    }));

    // Auto-expand section containing active route
    if (section && !sidebarState.expandedSections.includes(section)) {
      expandSection(section);
    }
  }, [
    pathname,
    filteredNavigation,
    findActiveSection,
    sidebarState.expandedSections,
    expandSection,
  ]);

  return {
    // State
    sidebarState,
    filteredNavigation: filteredNavigation(),
    isLoading,

    // Actions
    toggleExpand,
    expandSection,
    collapseSection,
    collapseAll,

    // Getters
    isSectionExpanded,
    isSectionActive,

    // Utils
    findActiveSection,
  };
};
