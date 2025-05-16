import PressableButton from '@/components/PressableButton'
import { router } from 'expo-router'
import { Text, View } from 'react-native'


const LoginPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: '5%' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Login Page</Text>

      <PressableButton
        TextSize={16}
        width={"100%"}
        height={60}
        type="primary"
        IconSize={24}
        color={"#DEE3F2"}
        direction="column"
        Title="Login"
        onPress={() => router.replace('/(tabs)/HomeScreen')}
      ></PressableButton>

    </View>
  )
}

export default LoginPage