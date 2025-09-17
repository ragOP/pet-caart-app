import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react-native';
import { updateProfile } from '../../apis/updateProfile';

const ProfileDetailScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phoneNumber || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!name || !phone || !email) {
      Alert.alert('Error', 'Please fill in all fields');
    } else {
      try {
        const response = await updateProfile({
          data: {
            name,
            phoneNumber: phone,
            email,
          },
        });

        if (response) {
          Alert.alert('Success', 'Profile updated successfully');
        } else {
          Alert.alert('Error', 'There was an issue updating your profile');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

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
            <Text style={styles.header}>Personal Details</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
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

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#6A6868"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE</Text>
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
  content: {
    flex: 1,
    padding: 20,
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
    backgroundColor: '#0888B1',
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

export default ProfileDetailScreen;
