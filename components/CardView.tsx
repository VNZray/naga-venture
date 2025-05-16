import React from 'react';
import { StyleSheet, useColorScheme as useRNColorScheme, View, ViewStyle } from 'react-native';

export function useColorScheme() {
    const scheme = useRNColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
  }

type CardViewProps = {
    children?: React.ReactNode;
    background?: string;
    image?: string;
    elevation?: number;
    width?: number;
    height?: number;
    radius?: number;
};

const CardView: React.FC<CardViewProps> = ({
    children,
    background,
    image,
    elevation,
    width,
    height,
    radius,
}) => {
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundImage: image ? `url(${image})` : undefined,
                    width,
                    height,
                    borderRadius: radius,
                    elevation,
                } as ViewStyle,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 20,
    },
});

export default CardView;
