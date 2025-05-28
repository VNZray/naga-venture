import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ value, onChangeText, placeholder = 'Search' }) => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? '#fff' : '#000';
    const backgroundColor = colorScheme === 'dark' ? '#2c2c2c' : '#f5f5f5';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <FontAwesome5 name="search" size={16} color={color} style={styles.icon} />
            <TextInput
                style={[styles.input, { color }]}
                placeholder={placeholder}
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#666'}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
});

export default SearchBar; 