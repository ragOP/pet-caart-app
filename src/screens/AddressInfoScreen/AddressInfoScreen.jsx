import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { ArrowLeft, MoreVertical, CheckCircle } from 'lucide-react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { getAddresses } from '../../apis/getAddresses';
import { deleteAddress } from '../../apis/deleteAddress';
import AddressShimmer from '../../ui/Shimmer/AddressShimmer';

const AddressInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisibleId, setMenuVisibleId] = useState(null);

  const applyOptimisticAppend = useCallback(() => {
    const optimistic = route.params?.newlyAddedAddress;
    if (optimistic) {
      setAddresses(prev => {
        // avoid duplicate if already present
        if (prev.some(a => a.id === optimistic.id)) return prev;
        return [optimistic, ...prev];
      });
      // clear param so it doesn't re-append on next focus
      navigation.setParams({ newlyAddedAddress: undefined });
    }
  }, [navigation, route.params]);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAddresses();
      if (response && response.success) {
        const formatted = response.data.map(item => ({
          id: item._id,
          name: `${item.firstName} ${item.lastName}`,
          address: item.address,
          phone: item.phone,
          city: item.city,
          country: item.country,
          state: item.state,
          zip: item.zip,
          isDefault: item.isDefault,
          type: item.type,
        }));
        setAddresses(formatted);
      }
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // First mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Focus par hamesha refresh + optimistic param process
  useFocusEffect(
    useCallback(() => {
      applyOptimisticAppend();
      fetchAddresses();
    }, [applyOptimisticAppend, fetchAddresses]),
  );

  const toggleMenu = id => setMenuVisibleId(prev => (prev === id ? null : id));

  const handleEdit = id => {
    const selectedAddress = addresses.find(a => a.id === id);
    navigation.navigate('AddAddressScreen', { addressData: selectedAddress });
  };

  const handleDelete = id => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'No', onPress: () => setMenuVisibleId(null), style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await deleteAddress({ id });
              if (response && response.success) {
                setAddresses(prev => prev.filter(a => a.id !== id));
              }
            } catch (e) {}
            setMenuVisibleId(null);
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Address Information</Text>
          </View>
        </SafeAreaView>
      </View>

      <Text style={styles.subHeader}>Saved Addresses</Text>

      {loading ? (
        <AddressShimmer />
      ) : addresses.length > 0 ? (
        <ScrollView contentContainerStyle={styles.addressList}>
          {addresses.map(item => (
            <View key={item.id} style={styles.addressCard}>
              <View style={styles.cardTopRight}>
                <TouchableOpacity onPress={() => toggleMenu(item.id)}>
                  <MoreVertical size={20} color="#333" />
                </TouchableOpacity>
                {menuVisibleId === item.id && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      onPress={() => handleEdit(item.id)}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Text style={styles.addressText}>
                <Text style={styles.boldText}>{item.name}, </Text>
                {item.address},{item.city},
                {item.state?.charAt(0).toUpperCase() + item.state?.slice(1)}-
                {item.zip},{item.country}
              </Text>

              <View style={styles.mobileRow}>
                <Text style={styles.phoneText}>
                  Mobile No. : <Text style={styles.boldText}>{item.phone}</Text>
                </Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <CheckCircle size={15} color="#004E6A" />
                    <Text style={styles.defaultText}>Default Address</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/add.png')}
            style={styles.image}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddAddressScreen')}
        activeOpacity={1}
        style={styles.saveButton}
      >
        <Text style={styles.saveText}>+ ADD NEW ADDRESS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: { paddingRight: 15 },
  header: {
    fontSize: 24,
    flex: 1,
    paddingLeft: 20,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  subHeader: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    marginVertical: 10,
    fontFamily: 'Gotham-Rounded-Medium',
    borderBottomWidth: 0.2,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { resizeMode: 'contain', width: 300, height: 300 },
  saveButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    borderColor: '#0888B1',
    borderWidth: 1.5,
  },
  saveText: {
    color: '#0888B1',
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  addressList: { paddingHorizontal: 15, paddingBottom: 20, paddingTop: 20 },
  addressCard: {
    backgroundColor: '#F59A110D',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    position: 'relative',
  },
  cardTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 4,
    width: 100,
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 10 },
  menuText: { fontSize: 14, fontFamily: 'Gotham-Rounded-Medium' },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  phoneText: { fontSize: 14, fontFamily: 'Gotham-Rounded-Medium' },
  boldText: { fontWeight: 'bold' },
  mobileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004E6A1A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  defaultText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default AddressInfoScreen;
