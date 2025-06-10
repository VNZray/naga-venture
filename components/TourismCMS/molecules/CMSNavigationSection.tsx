// filepath: components/TourismCMS/molecules/CMSNavigationSection.tsx
import { NavigationItem } from '@/types/navigation';
import React from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { CMSNavigationDropdownIndicator, CMSNavigationItem } from '../atoms';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CMSNavigationSectionProps {
  section: NavigationItem;
  isExpanded?: boolean;
  isActive?: boolean;
  activeSubsection?: string;
  expandedSections?: string[]; // Add expanded sections array
  level?: number;
  onToggleExpand?: (sectionId: string) => void;
  onNavigate?: (path: string) => void;
}

/**
 * CMSNavigationSection - Molecule Component
 *
 * Expandable navigation section that can contain subsections.
 * Handles expand/collapse animations and nested navigation items.
 *
 * @param section - Navigation section configuration
 * @param isExpanded - Whether the section is currently expanded
 * @param isActive - Whether this section contains the active route
 * @param activeSubsection - ID of the currently active subsection
 * @param level - Nesting level for indentation
 * @param onToggleExpand - Handler for expanding/collapsing sections
 * @param onNavigate - Handler for navigation events
 */
export const CMSNavigationSection: React.FC<CMSNavigationSectionProps> = ({
  section,
  isExpanded = false,
  isActive = false,
  activeSubsection,
  expandedSections = [],
  level = 0,
  onToggleExpand,
  onNavigate,
}) => {
  const [subsectionHeight] = React.useState(
    new Animated.Value(isExpanded ? 1 : 0)
  );

  const hasSubsections = section.subsections && section.subsections.length > 0;

  React.useEffect(() => {
    if (hasSubsections) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(subsectionHeight, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded, hasSubsections, subsectionHeight]);
  const handleSectionPress = () => {
    if (hasSubsections && onToggleExpand) {
      onToggleExpand(section.id);
    } else if (section.path && onNavigate) {
      // ✅ CORRECT: Call the onNavigate prop directly
      onNavigate(section.path);
    }
  };

  const handleIndicatorPress = () => {
    if (hasSubsections && onToggleExpand) {
      onToggleExpand(section.id);
    }
  };

  const renderMainItem = () => (
    <View style={styles.mainItemContainer}>
      <View style={styles.mainItemContent}>
        <CMSNavigationItem
          item={section}
          isActive={isActive && !activeSubsection}
          level={level}
          onPress={handleSectionPress}
        />
      </View>

      {hasSubsections && (
        <CMSNavigationDropdownIndicator
          isExpanded={isExpanded}
          onPress={handleIndicatorPress}
          hasItems={hasSubsections}
        />
      )}
    </View>
  );

  const renderSubsections = () => {
    if (!hasSubsections || !section.subsections) {
      return null;
    }

    return (
      <Animated.View
        style={[
          styles.subsectionsContainer,
          {
            opacity: subsectionHeight,
            maxHeight: subsectionHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000], // Max height for subsections
            }),
          },
        ]}
        pointerEvents={isExpanded ? 'auto' : 'none'}
      >
        {' '}
        {section.subsections.map((subsection) => {
          const isSubsectionActive = activeSubsection === subsection.id;

          if (subsection.type === 'dropdown' && subsection.subsections) {
            // Nested dropdown section - check if this specific subsection is expanded
            const isSubsectionExpanded = expandedSections.includes(
              subsection.id
            );

            return (
              <CMSNavigationSection
                key={subsection.id}
                section={subsection}
                isExpanded={isSubsectionExpanded}
                isActive={isSubsectionActive}
                expandedSections={expandedSections}
                level={level + 1}
                onToggleExpand={onToggleExpand}
                onNavigate={onNavigate}
              />
            );
          } else {
            // Single navigation item
            return (
              <CMSNavigationItem
                key={subsection.id}
                item={subsection}
                isActive={isSubsectionActive}
                isSubsection={true}
                level={level + 1}
                onPress={() => {
                  // ✅ CORRECT: Call the onNavigate prop directly inside the press handler.
                  // Do not rely on a stale closure from a memoized function.
                  if (subsection.path && onNavigate) {
                    onNavigate(subsection.path);
                  }
                }}
              />
            );
          }
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderMainItem()}
      {renderSubsections()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
  },
  mainItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainItemContent: {
    flex: 1,
  },
  subsectionsContainer: {
    overflow: 'hidden',
  },
});
