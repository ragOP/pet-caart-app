import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SearchBar = () => {
  const data = ["Search 'Dog Food'", "Search 'Cat Food'", "Search 'Pedigree'"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('ProductListScreen', {
        searchQuery, // Pass the search query here
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prevIndex => (prevIndex + 1) % data.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={data[placeholderIndex]}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit} // Trigger search on submit
        />
        <Search color="#004E6A" size={20} onPress={handleSearchSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#4040400D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
    borderRadius: 12,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'gotham-rounded-book',
  },
});

export default SearchBar;
