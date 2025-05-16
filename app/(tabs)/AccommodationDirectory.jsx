import { Link } from 'expo-router'
import { Text, View } from 'react-native'

const AccommodationDirectory = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Accommodation Directory</Text>
      <Link href="/(tabs)/HomeScreen">Home</Link>
    </View>
  )
}

export default AccommodationDirectory