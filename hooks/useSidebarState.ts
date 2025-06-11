// hooks/useSidebarState.ts
import { useAuth } from '@/context/AuthContext'; // Import useAuth for user context
import { NavigationItem, SidebarState } from '@/types/navigation';
import { UserRole } from '@/types/supabase';
import { useCallback, useEffect, useReducer } from 'react';
import { usePersistentState } from './usePersistentState';

// Sidebar Actions
type SidebarAction =
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'SET_EXPANDED_SECTIONS'; payload: string[] }
  | { type: 'AUTO_EXPAND_SECTION'; payload: string }
  | { type: 'SET_USER_ROLE'; payload: UserRole | undefined };

// Sidebar Reducer
function sidebarReducer(
  state: SidebarState,
  action: SidebarAction
): SidebarState {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSection: action.payload,
      };

    case 'TOGGLE_SECTION':
      const isExpanded = state.expandedSections.includes(action.payload);
      return {
        ...state,
        expandedSections: isExpanded
          ? state.expandedSections.filter((id) => id !== action.payload)
          : [...state.expandedSections, action.payload],
      };

    case 'SET_EXPANDED_SECTIONS':
      return {
        ...state,
        expandedSections: action.payload,
      };

    case 'AUTO_EXPAND_SECTION':
      if (state.expandedSections.includes(action.payload)) {
        return state; // Already expanded
      }
      return {
        ...state,
        expandedSections: [...state.expandedSections, action.payload],
      };

    case 'SET_USER_ROLE':
      return {
        ...state,
        userRole: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Custom hook for managing sidebar state with user-specific persistence
 *
 * This hook now properly isolates sidebar state per user, ensuring that:
 * - Each user's expanded sections are saved separately
 * - When a user logs out, their state is preserved for their next login
 * - When a different user logs in, they get their own clean/saved state
 * - No shared state contamination between different admin users
 *
 * @param userRole - Current user role
 * @param pathname - Current pathname for active section detection
 * @param filteredNavigation - Filtered navigation items
 * @returns Sidebar state and actions
 */
export function useSidebarState(
  userRole: UserRole | undefined,
  pathname: string,
  filteredNavigation: NavigationItem[]
) {
  // Get the current user from the AuthContext
  const { user } = useAuth();

  // Call the updated hook with the base key and the user's ID
  const [persistedExpandedSections, setPersistedExpandedSections] =
    usePersistentState<string[]>(
      '@TourismCMS:ExpandedSections', // Base key
      user?.id, // User-specific part of the key
      [] // Initial state
    );

  // Initialize reducer with persisted state
  const [state, dispatch] = useReducer(sidebarReducer, {
    expandedSections: persistedExpandedSections,
    activeSection: '',
    userRole,
  });
  // Sync persisted expanded sections with reducer state
  useEffect(() => {
    dispatch({
      type: 'SET_EXPANDED_SECTIONS',
      payload: persistedExpandedSections,
    });
  }, [persistedExpandedSections]);

  // Update user role when it changes
  useEffect(() => {
    dispatch({ type: 'SET_USER_ROLE', payload: userRole });
  }, [userRole]);

  // Find active section based on current path
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

  // Update active section based on current route
  useEffect(() => {
    const { section, subsection } = findActiveSection(
      filteredNavigation,
      pathname
    );
    const activeSection = subsection || section;

    dispatch({ type: 'SET_ACTIVE_SECTION', payload: activeSection });

    // Auto-expand section containing active route
    if (section && !state.expandedSections.includes(section)) {
      dispatch({ type: 'AUTO_EXPAND_SECTION', payload: section });
      setPersistedExpandedSections((prev) => [...prev, section]);
    }
  }, [
    pathname,
    filteredNavigation,
    findActiveSection,
    state.expandedSections,
    setPersistedExpandedSections,
  ]);

  // Handle section expand/collapse
  const handleToggleExpand = useCallback(
    (sectionId: string) => {
      dispatch({ type: 'TOGGLE_SECTION', payload: sectionId });

      // Update persisted state
      setPersistedExpandedSections((prev) => {
        const isExpanded = prev.includes(sectionId);
        return isExpanded
          ? prev.filter((id) => id !== sectionId)
          : [...prev, sectionId];
      });
    },
    [setPersistedExpandedSections]
  );
  return {
    sidebarState: state,
    handleToggleExpand,
  };
}
