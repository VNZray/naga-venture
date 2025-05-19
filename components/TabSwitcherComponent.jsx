import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const TabSwitcher = ({ tabs, activeTab, onTabChange, color, active }) => {

    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];
    const borderColor = colorScheme === 'dark' ? '#F8F8F8' : active;

    const [fontsLoaded] = useFonts({
        'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
        'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
        'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    });

    if (!fontsLoaded) return null;

    return (
        <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    onPress={() => onTabChange(tab.key)}
                    style={[
                        styles.tab,
                        {
                            backgroundColor: themeColors.background,
                            shadowColor: borderColor,
                            shadowOpacity: borderColor ? 0.1 : 0.2,
                            shadowOffset: { width: 0, height: 0 },
                            shadowRadius: 3,
                            elevation: 4, // <-- Android shadow
                        },
                        activeTab === tab.key && {
                            borderWidth: 0.2,
                            borderColor: active,
                            backgroundColor: active,
                            elevation: 6, // <-- Higher elevation for active tab on Android
                            shadowColor: active, // Darker shadow for active on iOS
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === tab.key && styles.activeTabText,
                            { color: activeTab === tab.key ? '#fff' : color, fontFamily: 'Poppins-Medium' }
                        ]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.2,
        borderRadius: 6,
        backgroundColor: '#fff',
        elevation: 4, // default elevation for Android
        shadowColor: '#000', // iOS fallback
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tabText: {
        color: '#888',
        textAlign: 'center',
        fontSize: 12
    },
    activeTabText: {
        textAlign: 'center',
    },
});


export default TabSwitcher;