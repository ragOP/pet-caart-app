import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ArrowLeft } from 'lucide-react-native';
import stateList from '../../constants/stateList';
import { createAddress } from '../../apis/createAddress';

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
  const [country, setCountry] = useState('India');
  const [isStateDropdownFocus, setIsStateDropdownFocus] = useState(false);
  const [isCountryDropdownFocus, setIsCountryDropdownFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  useEffect(() => {
    if (addressData) {
      console.log('Filling form with address data: ', addressData);
      const [firstName, lastName] = addressData.name.split(' ');
      setFirstName(firstName);
      setLastName(lastName);
      setPhone(addressData.phone);
      setAddress(addressData.address);
      setCity(addressData.city);
      setPostalCode(addressData.zip);
      setAddressType(
        addressData.type.charAt(0).toUpperCase() + addressData.type.slice(1),
      );
      setCountry(addressData.country);
      setState(addressData.state);
      setIsDefaultAddress(addressData.isDefault);
    }
  }, [addressData]);
  const handleSave = async () => {
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !city ||
      !postalCode ||
      !addressType ||
      !state
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zip: postalCode,
        country,
        type: addressType.toLowerCase(),
        iisDefault: isDefaultAddress,
        state_code: state,
      };
      await createAddress({ data });
      Alert.alert(
        'Success',
        addressData
          ? 'Address updated successfully'
          : 'Address added successfully',
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not save address');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const countryList = [
    { label: 'India', value: 'India' },
    { label: 'Other', value: 'Other' },
  ];

  const formattedStateList = stateList.map(stateObj => ({
    label: stateObj.label,
    value: stateObj.value,
  }));
  const addressTypeOptions = [
    { label: 'Home', value: 'Home' },
    { label: 'Office', value: 'Office' },
    { label: 'Other', value: 'Other' },
  ];
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF5E1"
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
            <Text style={styles.header}>
              {addressData ? 'Edit Address' : 'Add Address'}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <Text style={styles.subHeader}>
        {addressData ? 'Edit Your Address' : 'New Address'}
      </Text>

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
        <Text style={styles.label}>Postal/ZIP Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Postal/ZIP Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
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

        <Text style={styles.label}>State/Province </Text>
        {country === 'India' ? (
          <Dropdown
            style={[
              styles.dropdown,

              isStateDropdownFocus && { borderColor: '#004E6A' },
            ]}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={formattedStateList}
            labelField="label"
            valueField="value"
            onChange={item => setState(item.value)}
            value={state}
            onFocus={() => setIsStateDropdownFocus(true)}
            onBlur={() => setIsStateDropdownFocus(false)}
            placeholder="Select your state"
            dropdownPosition="bottom"
            renderItem={item => (
              <View style={styles.dropdownListItem}>
                <Text style={styles.dropdownListItemText}>{item.label}</Text>
              </View>
            )}
            search={true}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Enter your state"
            value={state}
            onChangeText={setState}
            placeholderTextColor="#6A6868"
          />
        )}
        <Text style={styles.label}>Address Type</Text>
        <Dropdown
          style={[styles.dropdown]}
          itemTextStyle={{
            fontSize: 16,
            fontFamily: 'Gotham-Rounded-Medium',
          }}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={addressTypeOptions}
          labelField="label"
          valueField="value"
          onChange={item => setAddressType(item.value)}
          value={addressType}
          placeholder="Select address type"
          renderItem={item => (
            <View style={styles.dropdownListItem}>
              <Text style={{ ...styles.dropdownListItemText, fontSize: 16 }}>
                {item.label}
              </Text>
            </View>
          )}
          search={false}
        />

        <Text style={styles.label}>Country/Region</Text>
        <Dropdown
          style={[
            styles.dropdown,
            isCountryDropdownFocus && { borderColor: '#004E6A' },
          ]}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={countryList}
          labelField="label"
          valueField="value"
          onChange={item => {
            setCountry(item.value);
            if (item.value !== 'India') {
              setState('');
            }
          }}
          value={country}
          onFocus={() => setIsCountryDropdownFocus(true)}
          onBlur={() => setIsCountryDropdownFocus(false)}
          placeholder="Select your country"
          dropdownPosition="bottom"
          renderItem={item => (
            <View style={styles.dropdownListItem}>
              <Text style={styles.dropdownListItemText}>{item.label}</Text>
            </View>
          )}
          search={false}
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            activeOpacity={1}
            onPress={() => setIsDefaultAddress(!isDefaultAddress)}
          >
            {isDefaultAddress && <View style={styles.checkboxTick} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={isLoading}
        activeOpacity={1}
      >
        {isLoading ? (
          <ActivityIndicator size={25} color="#FFFFFF" />
        ) : (
          <Text style={styles.saveText}>SAVE ADDRESS</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'Gotham-Rounded-Medium',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    height: 45,
    borderWidth: 0.7,
    borderColor: '#B3B3B3',
    borderRadius: 7,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    paddingRight: 18,
  },
  dropdownListItem: {
    padding: 10,
  },
  dropdownListItemText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#6A6868',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#004E6A',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#004E6A',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTick: {
    width: 16,
    height: 16,
    backgroundColor: '#004E6A',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default AddAddressScreen;
