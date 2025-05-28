import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

type FavoriteButtonProps = {
    initialFavorite?: boolean;
    size?: number;
    color?: string;
    onToggle?: (isFavorite: boolean) => void;
};

const FavoriteButton = ({
    initialFavorite = false,
    size = 28,
    color = '#FF4E4E',
    onToggle,
}: FavoriteButtonProps) => {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);

    const toggleFavorite = () => {
        const updated = !isFavorite;
        setIsFavorite(updated);
        onToggle?.(updated);
    };

    return (
        <Pressable onPress={toggleFavorite} style={styles.button}>
            <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={size}
                color={color}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
});

export default FavoriteButton;
