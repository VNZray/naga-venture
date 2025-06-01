import { ShopColors } from '@/constants/ShopColors';
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

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 20,
      marginTop: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ShopColors.cardBackground,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: ShopColors.border,
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
      color: ShopColors.textPrimary,
      lineHeight: 20,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={ShopColors.iconPrimary} 
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={ShopColors.textSecondary}
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
