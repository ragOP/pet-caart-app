import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar, SafeAreaView, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const AddAddressScreen = ({ route, navigation }) => {
  const { addressData } = route.params || {}; 

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (addressData) {
      console.log("Filling form with address data: ", addressData);
      const [firstName, lastName] = addressData.name.split(' ');
      setFirstName(firstName); 
      setLastName(lastName);   
      setPhone(addressData.phone); 
      setAddress(addressData.address); 
      setCity(addressData.city);
      setPostalCode(addressData.zip);  
      setAddressType(''); 
      setState(addressData.state.charAt(0).toUpperCase() + addressData.state.slice(1));
    }
  }, [addressData]);
  const handleSave = () => {
    if (!firstName || !lastName || !phone  || !address || !city || !postalCode || !addressType || !state) {
      Alert.alert('Error', 'Please fill in all fields');
    } else {
      if (addressData) {
        Alert.alert('Success', 'Address updated successfully');
      } else {
        Alert.alert('Success', 'Address added successfully');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" translucent={false} />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>{addressData ? 'Edit Address' : 'Add Address'}</Text>
          </View>
        </SafeAreaView>
      </View>

      <Text style={styles.subHeader}>{addressData ? 'Edit Your Address' : 'New Address'}</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#6A6868"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#6A6868"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#6A6868"
        />
      <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#6A6868"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#6A6868"
        />

        <Text style={styles.label}>Postal/ZIP Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Postal/ZIP Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
          placeholderTextColor="#6A6868"
        />

        <Text style={styles.label}>Address Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Address Type"
          value={addressType}
          onChangeText={setAddressType}
          placeholderTextColor="#6A6868"
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your state"
          value={state}
          onChangeText={setState}
          placeholderTextColor="#6A6868"
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE ADDRESS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF6',
  },
  header: {
    fontSize: 24,
    flex: 1,
    paddingLeft: 20,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    paddingRight: 15,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  input: {
    height: 45,
    borderWidth: 0.7,
    borderColor: '#B3B3B3',
    borderRadius: 7,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: 'Gotham-Rounded-Light',
  },
  saveButton: {
    backgroundColor: '#F59A11',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default AddAddressScreen;
