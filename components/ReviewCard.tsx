import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import {
  DimensionValue,
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme as useRNColorScheme,
} from 'react-native';
import { ThemedText } from './ThemedText';

const getShadowStyle = (elevation: number, isDarkMode: boolean): ViewStyle => {
  if (elevation === 0) {
    return {
      shadowColor: 'transparent',
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
    };
  }

  const shadowStyles: Record<number, ViewStyle> = {
    1: {
      shadowColor: isDarkMode ? '#fff' : '#000',
      shadowOpacity: 0.1,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
    },
    2: {
      shadowColor: isDarkMode ? '#fff' : '#000',
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    3: {
      shadowColor: isDarkMode ? '#fff' : '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    4: {
      shadowColor: isDarkMode ? '#fff' : '#000',
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    5: {
      shadowColor: isDarkMode ? '#fff' : '#000',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
  };

  return shadowStyles[elevation] ?? shadowStyles[1];
};

export function useColorScheme() {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

type ReviewCardProps = {
  children?: React.ReactNode;
  background?: string;
  elevation?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  imageUri?: string;
  style?: StyleProp<ViewStyle>;
  reviewText?: string;
  reviewerName?: string;
  reviewDate?: string;
  profileImageUri?: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  children,
  elevation = 1,
  width = '100%',
  height,
  radius = 12,
  profileImageUri,
  reviewText = 'This is a sample review.',
  reviewerName = 'John Doe',
  reviewDate = 'May 24, 2025',
  style,
}) => {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  // Use platform-specific shadow styles
  const shadowStyle =
    Platform.OS === 'ios' ? getShadowStyle(elevation, isDark) : {};

  return (
    <ThemedView
      style={[
        {
          width,
          height,
          borderRadius: radius,
          elevation: Platform.OS === 'android' ? elevation : 0,
        } as ViewStyle,
        shadowStyle,
        style,
      ]}
    >
      <View style={styles.header}>
        <Image
          source={{
            uri:
              profileImageUri ??
              'https://www.gravatar.com/avatar/placeholder?d=mp',
          }}
          style={styles.avatar}
        />
        <View>
          <ThemedText style={styles.name}>{reviewerName}</ThemedText>
          <ThemedText style={styles.date}>{reviewDate}</ThemedText>
        </View>

        <View style={{ marginLeft: 'auto' }}>
          <Text style={styles.ratingText}>★★★★★</Text>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.reviewText}>{reviewText}</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.viewMore}>View More</ThemedText>
        </TouchableOpacity>
      </View>
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 8,
  },
  viewMore: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
  ratingText: {
    fontSize: 16,
    color: '#FFD700', // gold color
  },
});

export default ReviewCard;