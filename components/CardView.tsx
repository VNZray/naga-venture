import FavoriteButton from '@/components/FavoriteButton';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    useColorScheme as useRNColorScheme,
    View,
    ViewStyle
} from 'react-native';
import { ThemedText } from './ThemedText';
export function useColorScheme() {
    const scheme = useRNColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
}

type CardViewProps = {
    imageUri: string;
    title: string;
    subtitle: string;
    price: string;
    width?: number;
    height?: number;
    radius?: number;
    elevation?: number;
};

const CardView: React.FC<CardViewProps> = ({
    imageUri,
    title,
    subtitle,
    price,
    width,
    height,
    radius,
    elevation,
}) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const backgroundColor = isDarkMode ? '#151718' : '#FFFFFF';

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
            <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                <View style={styles.favoriteIcon}>
                    <FavoriteButton />
                </View>
            </View>

            <View
                style={[
                    styles.cardTextContainer,
                    {
                        backgroundColor,
                        shadowColor: isDarkMode ? '#f3f3f3' : '#000000',
                        shadowOpacity: isDarkMode ? 0 : 0.2,
                        shadowOffset: { width: 0, height: 0 },
                        shadowRadius: 6,
                    },
                ]}
            >
                <ThemedText type='cardTitle'>{title}</ThemedText>
                <ThemedText type='cardSubTitle'>
                    <MaterialCommunityIcons name="map-marker" size={14} color="#FFB007" /> {subtitle}
                </ThemedText>
                <ThemedText type='cardBoldSubTitle' style={styles.price}>{price}</ThemedText>
            </View>
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
    imageWrapper: {
        width: '100%',
        height: '88%',
        borderRadius: 10,
        position: 'absolute',
        top: 0,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    cardTextContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderRadius: 10,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    price: {
        color: '#FFB007',
    },
    favoriteIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        margin: 0,
        borderRadius: '50%',
    },
});

export default CardView;
