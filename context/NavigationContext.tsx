// filepath: context/NavigationContext.tsx
import { useNavigation } from '@/hooks/useNavigation';
import { NavigationItem, SidebarState } from '@/types/navigation';
import { UserRole } from '@/types/supabase';
import React, { createContext, ReactNode, useContext } from 'react';

interface NavigationContextType {
  // State
  sidebarState: SidebarState;
  filteredNavigation: NavigationItem[];
  isLoading: boolean;

  // Actions
  toggleExpand: (sectionId: string) => void;
  expandSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  collapseAll: () => void;

  // Getters
  isSectionExpanded: (sectionId: string) => boolean;
  isSectionActive: (sectionId: string) => boolean;

  // Utils
  findActiveSection: (
    items: NavigationItem[],
    path: string
  ) => { section: string; subsection?: string };
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
  userRole?: UserRole;
}

/**
 * NavigationProvider - Context Provider for Navigation State
 *
 * Provides navigation state and actions to child components.
 * Manages sidebar expand/collapse state, active sections, and role-based filtering.
 *
 * @param children - Child components
 * @param userRole - Current user's role for permission filtering
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  userRole,
}) => {
  const navigationHook = useNavigation(userRole);

  return (
    <NavigationContext.Provider value={navigationHook}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook to access navigation context
 *
 * @returns Navigation context value
 * @throws Error if used outside NavigationProvider
 */
export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider'
    );
  }

  return context;
};
