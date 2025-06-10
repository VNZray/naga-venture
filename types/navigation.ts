// filepath: types/navigation.ts
import { UserRole } from './supabase';

export interface NavigationBadge {
  count: number;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  type: 'single' | 'dropdown';
  permissions: UserRole[];
  badge?: NavigationBadge;
  subsections?: NavigationItem[];
}

export interface SidebarState {
  expandedSections: string[];
  activeSection: string;
  userRole?: UserRole;
}
