import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

const SearchBar = () => {
  const data = ["Search 'Dog Food'", "Search 'Cat Food'", "Search 'Pedigree'"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % data.length);
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
      />
      <Search color="#004E6A" size={20} />
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
