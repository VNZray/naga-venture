// Pull to Refresh Component for Shop Directory
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshing = false,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
}) => {
  const colorScheme = useColorScheme();
  
  const refreshColors = colorScheme === 'dark' ? ['#2E5AA7', '#4F7FBD'] : ['#2E5AA7', '#6B92C4'];
  
  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={refreshColors} // Android
            tintColor={refreshColors[0]} // iOS
            title="Pull to refresh shops..."
            titleColor={refreshColors[0]}
            progressBackgroundColor={colorScheme === 'dark' ? '#1E293B' : '#FFFFFF'}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default PullToRefresh;
