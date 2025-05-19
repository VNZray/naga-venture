import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CardContainer from '../../../../components/CardContainer';
import PressableButton from '../../../../components/PressableButton';

const TouristSpotDirectory = () => {

    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? '#fff' : '#000';

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView>
                    <View style={{ flex: 1, paddingLeft: 20, paddingTop: 0, paddingRight: 20, paddingBottom: 0 }}>
                        <CardContainer elevation={2} style={[styles.directories]} height={'auto'}>
                            <PressableButton IconSize={24} color={color} direction='column' Title='Historical' Icon='university' onPress={() => router.push('/(tabs)/(home)/(touristSpots)/historical')}>
                            </PressableButton>

                            <PressableButton IconSize={24} color={color} direction='column' Title='Natural' Icon="tree"
                                onPress={() => router.push('/(tabs)/(home)/(touristSpots)/natural')}>
                            </PressableButton>

                            <PressableButton IconSize={24} color={color} direction='column' Title='Urban' Icon="building"
                                onPress={() => router.push('/(tabs)/(home)/(touristSpots)/urban')}>
                            </PressableButton>

                            <PressableButton IconSize={24} color={color} direction='column' Title='Museums' Icon="landmark"
                                onPress={() => router.push('/(tabs)/(home)/(touristSpots)/museum')}>
                            </PressableButton>

                            <PressableButton IconSize={24} color={color} direction='column' Title='Resorts' Icon="umbrella-beach"
                                onPress={() => router.push('/(tabs)/(home)/(touristSpots)/resorts')}>
                            </PressableButton>
                        </CardContainer>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    directories: {
        flex: 1,
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
})

export default TouristSpotDirectory

