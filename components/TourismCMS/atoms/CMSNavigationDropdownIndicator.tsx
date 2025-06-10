// filepath: components/TourismCMS/atoms/CMSNavigationDropdownIndicator.tsx
import { CaretRight } from 'phosphor-react-native';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface CMSNavigationDropdownIndicatorProps {
  isExpanded: boolean;
  onPress: () => void;
  hasItems?: boolean;
}

/**
 * CMSNavigationDropdownIndicator - Atom Component
 *
 * Animated chevron indicator for expandable navigation sections.
 * Rotates smoothly when expanded/collapsed.
 *
 * @param isExpanded - Whether the dropdown is currently expanded
 * @param onPress - Handler for indicator press
 * @param hasItems - Whether the section has items (affects visibility)
 */
export const CMSNavigationDropdownIndicator: React.FC<
  CMSNavigationDropdownIndicatorProps
> = ({ isExpanded, onPress, hasItems = true }) => {
  const rotateValue = React.useRef(
    new Animated.Value(isExpanded ? 1 : 0)
  ).current;

  React.useEffect(() => {
    Animated.timing(rotateValue, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateValue]);

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  if (!hasItems) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {' '}
      <Animated.View
        style={[styles.iconContainer, { transform: [{ rotate: rotation }] }]}
      >
        {' '}
        <CaretRight size={14} color="rgba(255, 255, 255, 0.6)" weight="bold" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginLeft: 8,
  },
  iconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
