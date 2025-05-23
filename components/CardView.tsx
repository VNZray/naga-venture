import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet, useColorScheme as useRNColorScheme, ViewStyle } from 'react-native';
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
};

const CardView: React.FC<CardViewProps> = ({
    children,
    image,
    elevation,
    width,
    height,
    radius,
}) => {
    return (
        <ThemedView
            style={[
                styles.card,
                {
                    backgroundImage: image ? `url(${image})` : 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                    width,
                    height,
                    borderRadius: radius,
                    elevation,
                } as ViewStyle,
            ]}
        >
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
    },
});

export default CardView;
