import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  recentSearches?: string[];
  onSelectRecent?: (search: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder,
  containerStyle,
  inputStyle,
  iconContainerStyle,
  recentSearches = [],
  onSelectRecent,
}) => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? '#fff' : '#000';
    const backgroundColor = colorScheme === 'dark' ? '#1c1c1c' : '#fff';
    const [isFocused, setIsFocused] = useState(false);

    const handleRecentSelect = (search: string) => {
      onSelectRecent?.(search);
      setIsFocused(false);
    };

  return (
    <View style={styles.wrapper}>
      <ThemedView style={[styles.container, containerStyle]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Search'}
          placeholderTextColor={color}
          style={[styles.input, inputStyle, {color: color}]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <TouchableOpacity onPress={onSearch} style={[styles.iconContainer, iconContainerStyle]}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </ThemedView>
      
      {isFocused && recentSearches.length > 0 && (
        <ThemedView style={[styles.recentSearches, { backgroundColor }]}>
          <ThemedText style={styles.recentTitle}>Recent Searches</ThemedText>
          <ScrollView style={styles.recentList}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => handleRecentSelect(search)}
              >
                <Ionicons name="time-outline" size={16} color={color} style={styles.recentIcon} />
                <ThemedText>{search}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconContainer: {
    backgroundColor: '#0A2342',
    padding: 16,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSearches: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  recentList: {
    maxHeight: 150,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recentIcon: {
    marginRight: 8,
  },
});

export default SearchBar;
