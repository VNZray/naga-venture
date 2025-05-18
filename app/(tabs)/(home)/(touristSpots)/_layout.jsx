import { Stack } from 'expo-router'

const TouristSpotsLayout = () => {
    return (
        <Stack screenOptions={{ headerBackTitle: 'Back', headerShown: true, headerTitle: 'Tourist Spots' }} >
            <Stack.Screen
                name="museum"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    headerTitleAlign: 'center',
                    headerTitle: 'Museum',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name="natural"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    headerTitleAlign: 'center',
                    headerTitle: 'Natural',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name="historical"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    headerTitleAlign: 'center',
                    headerTitle: 'Historical',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name="urban"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    headerTitleAlign: 'center',
                    headerTitle: 'Urban',
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name="resorts"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    headerTitleAlign: 'center',
                    headerTitle: 'Resorts',
                    headerBackTitle: 'Back',
                }}
            />
        </Stack>
    )
}

export default TouristSpotsLayout