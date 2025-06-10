// filepath: components/TourismCMS/atoms/CMSNavigationItem.tsx
import { useTheme } from '@/hooks/useTheme';
import { NavigationBadge, NavigationItem } from '@/types/navigation';
import { router } from 'expo-router';
import {
  Bed,
  Bell,
  Briefcase,
  Buildings,
  Calendar,
  CalendarCheck,
  Camera,
  ChartBar,
  ChartPie,
  CheckCircle,
  Circle,
  ClipboardText,
  Clock,
  ClockCounterClockwise,
  Compass,
  CreditCard,
  CurrencyDollarSimple,
  Database,
  FilePlus,
  FileText,
  Folder,
  Gear,
  Gift,
  LinkSimple,
  List,
  MapPin,
  MapTrifold,
  Mountains,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  SquaresFour,
  Star,
  Tag,
  TrendUp,
  User,
  UserPlus,
  Users,
  XCircle,
} from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CMSNavigationItemProps {
  item: NavigationItem;
  isActive?: boolean;
  isSubsection?: boolean;
  level?: number;
  onPress?: () => void;
}

/**
 * CMSNavigationItem - Atom Component
 *
 * Individual navigation item with icon, label, and optional badge.
 * Supports multiple nesting levels and active states.
 *
 * @param item - Navigation item configuration
 * @param isActive - Whether this item is currently active
 * @param isSubsection - Whether this is a subsection item
 * @param level - Nesting level (0, 1, 2) for indentation
 * @param onPress - Custom press handler (overrides default navigation)
 */
export const CMSNavigationItem: React.FC<CMSNavigationItemProps> = ({
  item,
  isActive = false,
  isSubsection = false,
  level = 0,
  onPress,
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (item.path) {
      router.push(item.path as any);
    }
  };
  const getPhosphorIcon = (iconName: string): React.ComponentType<any> => {
    // Map custom icon names to Phosphor icons
    const iconMap: Record<string, React.ComponentType<any>> = {
      dashboard: SquaresFour,
      users: Users,
      'user-shield': ShieldCheck,
      briefcase: Briefcase,
      user: User,
      building: Buildings,
      list: List,
      bed: Bed,
      'shopping-bag': ShoppingBag,
      star: Star,
      'clipboard-list': ClipboardText,
      'map-pin': MapPin,
      camera: Camera,
      mountain: Mountains,
      tag: Tag,
      calendar: Calendar,
      'credit-card': CreditCard,
      'bar-chart': ChartBar,
      'pie-chart': ChartPie,
      'trending-up': TrendUp,
      settings: Gear,
      shield: Shield,
      database: Database,
      bell: Bell,
      // Additional missing icons
      'file-plus': FilePlus,
      clock: Clock,
      history: ClockCounterClockwise,
      'x-circle': XCircle,
      map: MapTrifold,
      gift: Gift,
      'file-text': FileText,
      'check-circle': CheckCircle,
      folder: Folder,
      compass: Compass,
      'calendar-check': CalendarCheck,
      'dollar-sign': CurrencyDollarSimple,
      activity: TrendUp, // Using TrendUp as alternative for activity
      'user-plus': UserPlus,
      sliders: Sliders,
      link: LinkSimple,
    };

    return iconMap[iconName] || Circle;
  };
  const renderBadge = (badge: NavigationBadge) => {
    const badgeColors = {
      info: theme.colors.accent,
      warning: theme.colors.warning,
      error: theme.colors.error,
      success: theme.colors.success,
    };

    return (
      <View
        style={[styles.badge, { backgroundColor: badgeColors[badge.type] }]}
      >
        <Text style={styles.badgeText}>
          {badge.count > 99 ? '99+' : badge.count.toString()}
        </Text>
      </View>
    );
  };
  const paddingLeft = 12 + level * 16; // Reduced base padding + level indentation

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isActive ? 'rgba(46, 90, 167, 0.15)' : 'transparent', // Subtle accent background
          paddingLeft,
        },
        isSubsection && styles.subsectionItem,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {' '}
      <View style={styles.content}>
        {/* Only show icons for main navigation items, not subsections */}
        {!isSubsection &&
          React.createElement(getPhosphorIcon(item.icon), {
            size: 18,
            color: isActive ? '#2E5AA7' : 'rgba(255, 255, 255, 0.8)',
            weight: 'bold',
            style: styles.icon,
          })}
        <Text
          style={[
            styles.label,
            {
              color: isActive ? '#2E5AA7' : 'rgba(255, 255, 255, 0.9)', // White text for primary background
              fontSize: isSubsection ? 13 : 14, // Reduced font sizes
              fontWeight: isActive ? '600' : '500',
              marginLeft: isSubsection ? 8 : 0, // Add margin for subsections to align with main items
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.label}
        </Text>
        {item.badge && renderBadge(item.badge)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8, // Reduced from 12
    paddingHorizontal: 12, // Reduced from 16
    marginVertical: 0.5, // Reduced spacing
    borderRadius: 6, // Added subtle border radius
  },
  subsectionItem: {
    paddingVertical: 6, // Reduced from 10
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10, // Reduced from 12
    width: 18, // Reduced from 20
  },
  label: {
    flex: 1,
    fontSize: 14, // Reduced from 15
    fontWeight: '500',
    letterSpacing: 0.2, // Added for better readability
  },
  badge: {
    minWidth: 18, // Reduced from 20
    height: 18, // Reduced from 20
    borderRadius: 9, // Adjusted for new size
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5, // Reduced from 6
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10, // Reduced from 11
    fontWeight: '600',
  },
});
