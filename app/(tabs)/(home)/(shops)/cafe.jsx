import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

export default function CafeScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ThemedText type="sectionTitle">Bars</ThemedText>
    </View>
  );
}
