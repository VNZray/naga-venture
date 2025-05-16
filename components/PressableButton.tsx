import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
    const scheme = useRNColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
}

type PressableButtonProps = {
    direction?: 'row' | 'column';
    type?: 'primary' | 'secondary' | 'tertiary';
    gap?: number;
    color?: string;
    width?: string | number;
    height?: string | number;
    Title?: string;
    Icon?: keyof typeof FontAwesome.glyphMap;
    IconSize?: number;
    TextSize?: number | string;
    onPress?: () => void;
    onLongPress?: () => void;
}

const PressableButton = ({
    Title,
    Icon,
    color,
    direction,
    type,
    gap,
    IconSize,
    width,
    height,
    TextSize,
    onPress,
    onLongPress,
}: PressableButtonProps) => {
    const [fontsLoaded] = useFonts({
        'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
        'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
        'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    });

    if (!fontsLoaded) return null;

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
                styles.container, stylesByType[type ?? 'default'],
                {
                    flexDirection: direction || 'row',
                    gap: gap || 5,
                    opacity: pressed ? 0.6 : 1,
                    width: width,
                    height: height,
                },

            ]}
        >
            {Icon && <FontAwesome name={Icon} size={IconSize} color={color} style={styles.icon} />}
            {Title && <Text style={[styles.text, {
                color, fontSize: typeof TextSize === 'string' ? parseFloat(TextSize) : TextSize ?? 10,
            }]}>{Title}</Text>}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
    },
    icon: {
        marginRight: 0,
    },
    text: {
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
});

const stylesByType = StyleSheet.create({
    primary: {
        backgroundColor: '#007bff',
    },
    secondary: {
        backgroundColor: '#DEE3F2',
    },
    tertiary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ccc',
    }, default: {

    },
});
export default PressableButton;
