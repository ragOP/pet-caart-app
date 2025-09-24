import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MapPin, Truck, Ban, BadgePercent } from 'lucide-react-native';
import { checkDelivery } from '../../apis/checkDelivery';

const DeliverySection = () => {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckDelivery = async () => {
    if (pincode.length !== 6) {
      setError('Please enter a 6-digit pincode');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await checkDelivery({ pincode, productId: 'dummy' });
      console.log('API result:', result);
      console.log('Processed deliveryInfo:', {
        dateText: result.data,
        humanDate: result.data,
      });
      setDeliveryInfo({
        dateText: result.data,
      });
    } catch (err) {
      setError(err.message || 'Failed to check delivery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delivery & Service Information</Text>

      <View style={styles.pincodeRow}>
        <MapPin size={20} color="#F5A500" style={styles.pinIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter PINCODE"
          placeholderTextColor="#333"
          keyboardType="numeric"
          value={pincode}
          onChangeText={setPincode}
          maxLength={6}
        />
        <TouchableOpacity
          style={styles.checkButton}
          activeOpacity={1}
          onPress={handleCheckDelivery}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkText}>CHECK</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <View style={styles.infoRow}>
        <Truck size={24} color="#FFA600" style={styles.infoIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoText}>
            Expected delivery date -{' '}
            <Text style={styles.bold}>{deliveryInfo?.dateText}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <BadgePercent size={24} color="#349AFE" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Enjoy Free Delivery above <Text style={styles.bold}>₹699</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEBEB99',
    borderRadius: 18,
    padding: 10,
    marginTop: 12,
  },
  heading: {
    fontSize: 19,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#222',
    marginBottom: 14,
    letterSpacing: 0.1,
  },
  pincodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDEDED',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 20,
  },
  pinIcon: {
    marginRight: 7,
    marginLeft: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    paddingVertical: 2,
    paddingHorizontal: 4,
    letterSpacing: 0.1,
    fontFamily: 'gotham-rounded-book',
  },
  checkButton: {
    backgroundColor: '#F59A11',
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginLeft: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 13,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 1,
  },
  infoText: {
    fontSize: 17,
    color: '#222',
    flex: 1,
    fontFamily: 'gotham-rounded-book',
  },
  bold: {
    fontSize: 17,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
  },
  dateText: {
    marginTop: 2,
    color: '#444',
    fontSize: 17,
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default DeliverySection;
