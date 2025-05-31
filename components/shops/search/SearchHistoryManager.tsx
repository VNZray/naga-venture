// Search History Manager and Quick Search Shortcuts
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchHistoryManagerProps {
  onSearchSelect: (query: string) => void;
  visible: boolean;
  onClose: () => void;
}

interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultsCount: number;
}

const SEARCH_HISTORY_KEY = 'shop_search_history_detailed';

const SearchHistoryManager: React.FC<SearchHistoryManagerProps> = ({ 
  onSearchSelect, 
  visible, 
  onClose 
}) => {
  const colorScheme = useColorScheme();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  
  const backgroundColor = colorScheme === 'dark' ? '#0A1B47' : '#F8F8F8';
  const modalBackground = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';
  const cardBackground = colorScheme === 'dark' ? '#334155' : '#F8FAFB';
  const borderColor = colorScheme === 'dark' ? '#475569' : '#E5E7EB';

  useEffect(() => {
    if (visible) {
      loadSearchHistory();
      loadPopularSearches();
    }
  }, [visible]);

  const loadSearchHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        setSearchHistory(history.slice(0, 20)); // Show last 20 searches
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const loadPopularSearches = () => {
    // Simulated popular searches - in a real app, this would come from analytics
    const popular = [
      'restaurants near me', 'coffee shops', 'souvenir stores', 'local bars',
      'shopping malls', 'spa and wellness', 'fast food', 'bakeries'
    ];
    setPopularSearches(popular);
  };

  const saveSearchHistory = async (query: string, resultsCount: number = 0) => {
    try {
      const newItem: SearchHistoryItem = {
        query: query.trim(),
        timestamp: new Date().toISOString(),
        resultsCount,
      };

      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      let history: SearchHistoryItem[] = stored ? JSON.parse(stored) : [];
      
      // Remove duplicate if exists
      history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      
      // Add new item at the beginning
      history.unshift(newItem);
      
      // Keep only last 50 searches
      history = history.slice(0, 50);
      
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      setSearchHistory(history.slice(0, 20));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const handleSearchSelect = (query: string) => {
    onSearchSelect(query);
    onClose();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const quickSearchCategories = [
    { name: 'Restaurants', icon: 'restaurant', query: 'restaurants' },
    { name: 'Coffee', icon: 'cafe', query: 'coffee shops' },
    { name: 'Shopping', icon: 'bag', query: 'shopping' },
    { name: 'Bars', icon: 'wine', query: 'bars' },
    { name: 'Spa', icon: 'flower', query: 'spa' },
    { name: 'Bakery', icon: 'storefront', query: 'bakery' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: modalBackground }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Search History</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Search Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Search</Text>
            <View style={styles.quickSearchGrid}>
              {quickSearchCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickSearchItem, { backgroundColor: cardBackground, borderColor }]}
                  onPress={() => handleSearchSelect(category.query)}
                >
                  <Ionicons name={category.icon as any} size={24} color="#2E5AA7" />
                  <Text style={[styles.quickSearchText, { color: textColor }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Searches */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Popular Searches</Text>
            <View style={styles.popularSearches}>
              {popularSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.popularSearchItem, { backgroundColor: cardBackground, borderColor }]}
                  onPress={() => handleSearchSelect(search)}
                >
                  <Ionicons name="trending-up" size={16} color="#F59E0B" />
                  <Text style={[styles.popularSearchText, { color: textColor }]}>
                    {search}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Searches</Text>
              {searchHistory.length > 0 && (
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text style={[styles.clearText, { color: '#EF4444' }]}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {searchHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={subtextColor} />
                <Text style={[styles.emptyStateText, { color: subtextColor }]}>
                  No recent searches
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: subtextColor }]}>
                  Your search history will appear here
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {searchHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.historyItem, { borderBottomColor: borderColor }]}
                    onPress={() => handleSearchSelect(item.query)}
                  >
                    <View style={styles.historyItemLeft}>
                      <Ionicons name="time" size={20} color={subtextColor} />
                      <View style={styles.historyItemText}>
                        <Text style={[styles.historyQuery, { color: textColor }]}>
                          {item.query}
                        </Text>
                        <Text style={[styles.historyTimestamp, { color: subtextColor }]}>
                          {formatTimestamp(item.timestamp)}
                          {item.resultsCount > 0 && ` • ${item.resultsCount} results`}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={subtextColor} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Export the save function for use in the main search component
export const saveSearchToHistory = async (query: string, resultsCount: number = 0) => {
  try {
    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultsCount,
    };

    const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    let history: SearchHistoryItem[] = stored ? JSON.parse(stored) : [];
    
    // Remove duplicate if exists
    history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // Add new item at the beginning
    history.unshift(newItem);
    
    // Keep only last 50 searches
    history = history.slice(0, 50);
    
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  quickSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickSearchItem: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickSearchText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  popularSearches: {
    gap: 8,
  },
  popularSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  popularSearchText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 12,
  },
  historyList: {
    gap: 0,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyItemText: {
    marginLeft: 12,
    flex: 1,
  },
  historyQuery: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  historyTimestamp: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
});

export default SearchHistoryManager;
