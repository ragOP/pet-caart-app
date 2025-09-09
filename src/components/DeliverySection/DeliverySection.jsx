import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { MapPin, Truck, Ban, BadgePercent } from 'lucide-react-native';

const DeliverySection = () => {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Delivery & Service Information</Text>

      <View style={styles.pincodeRow}>
        <MapPin size={20} color="#F5A500" style={styles.pinIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter PINCODE to check delivery date"
          placeholderTextColor="#333"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.checkButton} activeOpacity={0.8}>
          <Text style={styles.checkText}>CHECK</Text>
        </TouchableOpacity>
      </View>

      {/* Expected Delivery Info Row */}
      <View style={styles.infoRow}>
        <Truck size={32} color="#FFA600" style={styles.infoIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoText}>
            Expected delivery date - <Text style={styles.bold}>Tomorrow</Text>
          </Text>
          <Text style={styles.dateText}>(Thu Jun 12 2025 - By 9PM)</Text>
        </View>
      </View>

      {/* No Exchange & Returns Row */}
      <View style={styles.infoRow}>
        <Ban size={32} color="#FFA600" style={styles.infoIcon} />
        <Text style={styles.infoText}>No Exchange & Returns</Text>
      </View>

      {/* Free Delivery Row */}
      <View style={styles.infoRow}>
        <BadgePercent size={32} color="#349AFE" style={styles.infoIcon} />
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
    // margin: 12,
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
    fontSize: 13,
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
