import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import { getBrands } from '../../apis/getBrands';

const BrandScreen = ({ navigation }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBrands = async () => {
      console.log('Fetching brands...');
      try {
        const response = await getBrands();
        console.log('API response:', response);
        if (response && response.data && Array.isArray(response.data.data)) {
          // console.log('Brands data:', response.data.data);
          setBrands(response.data.data);
        } else {
          console.warn('No valid brand data found.');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.logo }}
        style={styles.brandImg}
        resizeMode="cover"
      />
      <Text style={styles.brandName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={30} color="#000" />
          </TouchableOpacity>
          <SearchBar style={styles.searchBar} />
        </View>
      </View>
      <LinearGradient
        colors={['#F59A11', '#8B9259', '#0888B1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientTitle}
      >
        <Text style={styles.title}>BUDGET BUYS</Text>
      </LinearGradient>
      {loading ? (
        <ActivityIndicator size="large" color="#F59A11" style={styles.loader} />
      ) : (
        <FlatList
          data={brands}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          numColumns={3}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: { paddingRight: 15 },
  searchBar: { flex: 1 },
  gradientTitle: {
    marginHorizontal: 0,
    marginBottom: 15,
    paddingVertical: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: 85,
      },
    }),
  },
  title: {
    fontSize: 27,
    fontFamily: 'Gotham-Rounded-Bold',
    letterSpacing: 1.5,
    color: '#fff',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontSize: 24,
      },
    }),
  },
  grid: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 7,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 15,
    borderColor: '#ffe3ae',
    borderWidth: 2,
    minWidth: 105,
    maxWidth: 130,
  },
  brandImg: { width: '100%', height: 50, marginBottom: 13 },
  brandName: { fontSize: 16, fontFamily: 'Gotham-Rounded-Bold', color: '#222' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BrandScreen;
