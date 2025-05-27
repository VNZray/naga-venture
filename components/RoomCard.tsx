import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import {
  DimensionValue,
  Image,
  Platform,
  StyleProp,
  View,
  ViewStyle,
  useColorScheme as useRNColorScheme,
} from 'react-native';
import { ThemedText } from './ThemedText';

export function useColorScheme() {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

type RoomCardProps = {
  roomNumber: string | number;
  status: string;
  capacity: number;
  roomPrice: number;
  background?: string;
  elevation?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  imageUri?: string;
  style?: StyleProp<ViewStyle>;
};

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

const RoomCard: React.FC<RoomCardProps> = ({
  roomNumber,
  status,
  capacity,
  roomPrice,
  elevation = 1,
  radius = 10,
  imageUri,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const shadowStyle =
    Platform.OS === 'ios' ? getShadowStyle(elevation, isDarkMode) : {};

  return (
    <ThemedView
      style={[
        {
          width: '100%',
          borderRadius: radius,
          elevation: Platform.OS === 'android' ? elevation : 0,
          display: 'flex',
          flexDirection: 'row',
        } as ViewStyle,
        shadowStyle,
        style,
      ]}
    >
      {imageUri && (
        <View style={{ overflow: 'hidden', borderRadius: radius }}>
          <Image
            source={{ uri: imageUri }}
            resizeMode="cover"
            style={{
              width: 150,
              height: 150,
            }}
          />
        </View>
      )}
      <ThemedView style={{ padding: 10, borderRadius: 16 }}>
        <ThemedText type="cardBoldSubTitle">Room {roomNumber}</ThemedText>
        <ThemedText type="cardSubTitle">Status: {status}</ThemedText>
        <ThemedText type="cardSubTitle">Capacity: {capacity}</ThemedText>
        <ThemedText type="cardSubTitle">Price: ₱{roomPrice.toFixed(2)}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default RoomCard;
