import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import RawBottomSheet from 'react-native-raw-bottom-sheet';
import { MapPin, X } from 'lucide-react-native';
import { getAddresses } from '../../apis/getAddresses';

export const AddressBottomSheet = React.forwardRef(
  (
    { onSelectAddress, onAddAddress, selectedAddressId, defaultAddressId },
    ref,
  ) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await getAddresses({ params: {} });
        if (response && response.success) {
          setAddresses(
            response.data.map(item => ({
              id: item._id,
              name:
                item.firstName && item.lastName
                  ? `${item.firstName} ${item.lastName}`
                  : item.firstName || item.lastName || 'No Name',
              address: item.address,
              city: item.city,
              state: item.state,
              zip: item.zip,
              phone: item.phone,
              isDefault: item.isDefault,
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchAddresses();
    }, []);

    const renderItem = ({ item }) => {
      const isSelected =
        selectedAddressId === item.id ||
        (!selectedAddressId && defaultAddressId === item.id);

      return (
        <TouchableOpacity
          style={[styles.itemCard, isSelected && styles.selectedCard]}
          onPress={() => {
            onSelectAddress(item);
            ref.current.close();
          }}
          activeOpacity={0.85}
        >
          <View style={styles.row}>
            <MapPin
              size={20}
              color={isSelected ? '#F4B341' : '#B3B8BE'}
              style={{ marginRight: 7 }}
            />
            <Text style={[styles.name, isSelected && styles.selectedName]}>
              {item.name}
            </Text>
          </View>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.address}>
            {item.city}
            {item.state ? `, ${item.state}` : ''} - {item.zip}
          </Text>
          {item.phone && <Text style={styles.phone}>Phone: {item.phone}</Text>}
        </TouchableOpacity>
      );
    };

    return (
      <RawBottomSheet
        ref={ref}
        height={470}
        closeOnDragDown
        customStyles={{
          container: styles.bottomSheetContainer,
          draggableIcon: styles.draggableIcon,
        }}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Select Delivery Address</Text>
          {/* <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => ref.current?.close()}
            hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <X size={24} color="#636569" />
          </TouchableOpacity> */}
        </View>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} color="#888" />
        ) : addresses.length ? (
          <FlatList
            data={addresses}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            style={{ maxHeight: 350 }}
          />
        ) : (
          <View style={styles.noAddressContainer}>
            <Image
              source={require('../../assets/images/noadd.png')}
              style={styles.noAddressImage}
              resizeMode="contain"
            />
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.noAddressText}>
                Looks like you haven’t added a delivery address. Add one now to
                get your goodies delivered to the right doorstep!
              </Text>
              <Text style={styles.noAddressText}></Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            ref.current.close();
            onAddAddress();
          }}
        >
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </RawBottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  draggableIcon: {
    backgroundColor: '#ddd',
    width: 50,
    marginTop: 8,
    marginBottom: 8,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
    backgroundColor: '#fff6ee',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2D2D2D',
    textAlign: 'center',
    letterSpacing: 0.2,
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    right: 18,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
    zIndex: 2,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 18,
    shadowColor: 'rgba(96,110,146,0.07)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 0.5,
  },
  selectedCard: {
    backgroundColor: '#FFF8E6',
    borderColor: '#F4B341',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#636569',
  },
  selectedName: {
    color: '#F4B341',
  },
  address: {
    fontSize: 15,
    color: '#636569',
    marginBottom: 2,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  phone: {
    fontSize: 15,
    color: '#636569',
    marginTop: 4,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  loader: {
    paddingVertical: 50,
  },
  addButton: {
    backgroundColor: '#0B99C6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 18,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  noAddressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  noAddressImage: {
    width: 300,
    height: 200,
    marginBottom: 24,
  },
  noAddressText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'gotham-rounded-book',
    lineHeight: 20,
  },
});

export default AddressBottomSheet;
