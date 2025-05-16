import React from 'react';
import {
    Platform,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    useColorScheme as useRNColorScheme,
} from 'react-native';

export function useColorScheme() {
    const scheme = useRNColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
}

type CardContainerProps = {
    children?: React.ReactNode;
    background?: string;
    elevation?: number;
    width?: number | undefined;
    height?: number | string | undefined;
    radius?: number | undefined;
    style?: StyleProp<ViewStyle>;
};

const CardContainer: React.FC<CardContainerProps> = ({
    children,
    background,
    elevation = 1,
    width,
    height,
    radius = 10,
    style,
}) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: background || (isDarkMode ? '#1c1c1e' : '#ffffff'),
                    width,
                    height: height as any,
                    borderRadius: radius,
                    elevation: Platform.OS === 'android' ? elevation : 0,
                    shadowColor: isDarkMode ? '#f3f3f3' : '#000000',
                    shadowOpacity: isDarkMode ? 0.4 : 0.2,
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 6,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 5,
    },
});

export default CardContainer;
