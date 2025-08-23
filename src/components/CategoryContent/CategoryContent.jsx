import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';

const { width } = Dimensions.get('window');

const PAW_ICON = require('../../assets/icons/paw.png');

// Dynamic data based on category
const getBreedsByCategory = (category) => {
    if (category === 'dogs') {
        return [
            { name: 'German Shephard', img: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg' },
            { name: 'Labrador Retriever', img: 'https://images.pexels.com/photos/8700/pexels-photo.jpg' },
            { name: 'Doberman Pinscher', img: 'https://images.pexels.com/photos/733416/pexels-photo-733416.jpeg' },
            { name: 'American Pit Bull', img: 'https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg' },
            { name: 'Pug', img: 'https://images.pexels.com/photos/374906/pexels-photo-374906.jpeg' },
        ];
    } else if (category === 'cats') {
        return [
            { name: 'Persian', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
            { name: 'Siamese', img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
            { name: 'Maine Coon', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
            { name: 'British Shorthair', img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
            { name: 'Ragdoll', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
        ];
    }
    return [];
};

const getShopCategoriesByPet = (category) => {
    if (category === 'dogs') {
        return [
            { label: 'Dog Food', img: 'https://images.pexels.com/photos/4587997/pexels-photo-4587997.jpeg' },
            { label: 'Dog Treat & Chews', img: 'https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg' },
            { label: 'Walk & Travel Essentials', img: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg' },
            { label: 'Dog Toys', img: 'https://images.pexels.com/photos/4587999/pexels-photo-4587999.jpeg' },
            { label: 'Dog Clothing', img: 'https://images.pexels.com/photos/4588001/pexels-photo-4588001.jpeg' },
            { label: 'Grooming & Hygiene', img: 'https://images.pexels.com/photos/4588002/pexels-photo-4588002.jpeg' },
            { label: 'Dog Beds & Mats', img: 'https://images.pexels.com/photos/4588003/pexels-photo-4588003.jpeg' },
            { label: 'Bowls & Feeders', img: 'https://images.pexels.com/photos/4588004/pexels-photo-4588004.jpeg' },
        ];
    } else if (category === 'cats') {
        return [
            { label: 'Cat Food', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
            { label: 'Cat Treats', img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
            { label: 'Cat Toys', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
            { label: 'Cat Beds', img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
            { label: 'Cat Litter', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
            { label: 'Cat Grooming', img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
            { label: 'Cat Carriers', img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg' },
            { label: 'Cat Bowls', img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
        ];
    }
    return [];
};

const BRANDS = [
    { name: 'Whiskas', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Whiskas_logo.png', color: '#7B2FF2' },
    { name: 'Pedigree', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Pedigree_logo.png', color: '#FFD600' },
];

const SectionHeader = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
        <Image source={icon} style={styles.pawIcon} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const CategoryContent = ({ route, onRefresh, isRefreshing }) => {
    const currentCategory = route.key;
    const breeds = getBreedsByCategory(currentCategory);
    const shopCategories = getShopCategoriesByPet(currentCategory);
    const sectionTitle = currentCategory === 'dogs' ? 'Shop For Dogs' :
        currentCategory === 'cats' ? 'Shop For Cats' :
            `Shop For ${route.category?.name || currentCategory}`;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    colors={['#F4A300']}
                    tintColor="#F4A300"
                />
            }
        >
            {/* Shop By Breed */}
            <SectionHeader icon={PAW_ICON} title="Shop By Breed" />
            <FlatList
                data={breeds}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
                style={{ minHeight: 120 }}
                renderItem={({ item }) => (
                    <View style={styles.breedItem}>
                        <View style={styles.breedImageContainer}>
                            <Image source={{ uri: item.img }} style={styles.breedImg} />
                        </View>
                        <Text style={styles.breedLabel}>{item.name}</Text>
                    </View>
                )}
            />

            {/* Shop For Dogs/Cats */}
            <SectionHeader icon={PAW_ICON} title={sectionTitle} />
            <View style={styles.shopGrid}>
                {shopCategories.map((item) => (
                    <Card key={item.label} style={styles.shopCard}>
                        <Card.Content style={styles.shopCardContent}>
                            <View style={styles.shopImageContainer}>
                                <Image source={{ uri: item.img }} style={styles.shopImg} />
                            </View>
                            <Text style={styles.shopLabel}>{item.label}</Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            {/* Top Brands */}
            <SectionHeader icon={PAW_ICON} title="Top Brands" />
            <View style={styles.brandGrid}>
                {Array.from({ length: 9 }).map((_, idx) => {
                    const brand = BRANDS[idx % BRANDS.length];
                    return (
                        <View key={idx} style={styles.brandItem}>
                            <View style={[styles.brandCircle, { backgroundColor: brand.color }]}>
                                <Text style={styles.brandOffer}>FLAT 50% OFF</Text>
                                <Image source={{ uri: brand.img }} style={styles.brandImg} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    pawIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F4A300',
    },
    breedItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 80,
        marginBottom: 8,
    },
    breedImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    breedImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    breedLabel: {
        fontSize: 12,
        textAlign: 'center',
        color: '#333',
        fontWeight: '500',
        marginTop: 4,
    },
    shopGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    shopCard: {
        width: (width - 48) / 2,
        marginBottom: 16,
        backgroundColor: '#CEE6EE',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 0.8,
        borderColor: '#004E6A',
    },
    shopCardContent: {
        alignItems: 'center',
        padding: 16,
    },
    shopImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1.2,
        borderColor: '#004E6A33',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    shopImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    shopLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
    brandGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 8,
        marginBottom: 24,
    },
    brandItem: {
        width: (width - 64) / 3,
        alignItems: 'center',
        marginBottom: 16,
    },
    brandCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    brandOffer: {
        position: 'absolute',
        top: 6,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#222',
        borderRadius: 6,
        paddingHorizontal: 4,
        zIndex: 2,
    },
    brandImg: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginTop: 18,
    },
});

export default CategoryContent; 