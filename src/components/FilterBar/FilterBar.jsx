import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native'; 

const windowWidth = Dimensions.get('window').width;

const FilterBar = () => {
  const filterOptions = [
    { label: 'FILTERS', icon: <SlidersHorizontal size={20} color="#333" />, isActive: false },
    { label: 'Brand', isActive: true },
    { label: 'Breed ', isActive: true },
    { label: 'Rating ', isActive: true },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {filterOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, option.isActive && styles.activeButton]} 
          >
            {option.icon && option.icon} 
            <Text style={[styles.buttonText, option.isActive && styles.activeText]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    backgroundColor: '#FFFBF6',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingRight:20

  },
  scrollView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#f5f5f5', 
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
    marginLeft: 5, 
  },
  activeText: {
    color: '#000', 
  },
});

export default FilterBar;
