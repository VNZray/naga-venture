import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import type { ShopSearchProps } from './types';

const ShopSearch: React.FC<ShopSearchProps> = ({ 
  onSearch, 
  placeholder = 'Search shops...', 
  value 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Beautiful color scheme matching the enhanced design
  const colors = {
    textColor: isDark ? '#ffffff' : '#1A1A1A',
    placeholderColor: isDark ? '#94A3B8' : '#6B7280',
    backgroundColor: isDark ? '#334155' : '#F8FAFB',
    borderColor: isDark ? '#475569' : '#E5E7EB',
    iconColor: isDark ? '#94A3B8' : '#6B7280',
    focusColor: '#3B82F6',
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 20,
      marginTop: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundColor,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    icon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.textColor,
      lineHeight: 20,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={colors.iconColor} 
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholderColor}
          value={value}
          onChangeText={onSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

export default ShopSearch;
