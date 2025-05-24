import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Image, StyleSheet, useColorScheme as useRNColorScheme, ViewStyle } from 'react-native';

export function useColorScheme() {
    const scheme = useRNColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
}

type CardViewProps = {
    children?: React.ReactNode;
    image?: string;
    elevation?: number;
    width?: number;
    height?: number;
    radius?: number;
    style?: ViewStyle;
    showImage?: boolean;
};

const CardView: React.FC<CardViewProps> = ({
    children,
    image,
    elevation,
    width,
    height,
    radius,
    style,
    showImage = false,
}) => {
    const colorScheme = useColorScheme();
    
    return (
        <ThemedView
            style={[
                styles.card,
                {
                    width,
                    height,
                    borderRadius: radius,
                    elevation,
                } as ViewStyle,
                style,
            ]}
        >
            {showImage && image && (
                <Image 
                    source={{ uri: image }}
                    style={[
                        styles.backgroundImage,
                        { borderRadius: radius || 0 }
                    ]}
                    resizeMode="cover"
                />
            )}
            {children}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
});

export default CardView;
