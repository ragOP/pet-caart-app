import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
  const data = ["Search 'Dog Food'", "Search 'Cat Food'", "Search 'Pedigree'"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Breakpoints
  const isXS = width < 340;
  const isSM = width >= 340 && width < 380;

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (q) navigation.navigate('ProductListScreen', { searchQuery: q });
  };

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex(p => (p + 1) % data.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.shadowWrapper}>
      <View
        style={[
          styles.searchContainer,
          isXS && { height: 44, paddingHorizontal: 10 },
          isSM && { height: 48, paddingHorizontal: 12 },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            isXS && { fontSize: 14, paddingVertical: 6 },
            isSM && { fontSize: 15, paddingVertical: 8 },
          ]}
          placeholder={data[placeholderIndex]}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          numberOfLines={1}
          ellipsizeMode="tail"
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={handleSearchSubmit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Search color="#004E6A" size={isXS ? 18 : isSM ? 19 : 20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    width: '100%',
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
    paddingVertical: 10,
  },
});

export default SearchBar;
