import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOut,
  ChevronRight,
  UserRound,
  MapPinHouse,
  PackageOpen,
  UserRoundPlus,
  Headset,
} from 'lucide-react-native';
import { logout } from '../../redux/authSlice';
import CustomDialog from '../../components/CustomDialog/CustomDialog';
import ContainerWrapper from '../../components/Wrapper/ContainerWrapper';

const formatDateSince = (date) => {
  const options = { year: 'numeric', month: 'long' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);
  return `PetCaart member since ${formattedDate}`;
};

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const createdAt = user?.createdAt || '2022-01-15T10:30:00.000Z';
  const membershipSince = formatDateSince(createdAt);

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutDialog(false);
  };

  const loggedInMenuItems = [
    { label: 'Edit Profile', icon: <UserRound size={26} color="#004E6A" />, navigateTo: 'ProfileDetailScreen' },
    { label: 'Address Information', icon: <MapPinHouse size={26} color="#004E6A" />, navigateTo: 'AddressInfoScreen' },
    { label: 'My Orders', icon: <PackageOpen size={26} color="#004E6A" />, navigateTo: 'MyOrderScreen' },
    { label: 'Invite Friends', icon: <UserRoundPlus size={26} color="#004E6A" />, navigateTo: 'InviteScreen' },
    { label: 'Contact Us', icon: <Headset size={26} color="#004E6A" />, navigateTo: 'ContactUsScreen' },
    { label: 'Log Out', icon: <LogOut size={26} color="#004E6A" />, action: () => setShowLogoutDialog(true) },
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : [];

  return (
    <ContainerWrapper>
      <ScrollView style={styles.container}>

        {!isLoggedIn ? (
          <View style={styles.guestHeaderBox}>
            <View style={styles.guestRow}>
              <View style={styles.avatarWrapper}>
                <UserRound size={32} color="#004E6A" />
              </View>
              <TouchableOpacity
                style={styles.loginAction}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('LoginScreen')}
              >
                <Text style={styles.loginTitle}>Login / Signup</Text>
                <ChevronRight size={20} color="#004E6A" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.header}>
            <View style={styles.profileImageWrapper}>
              <View style={styles.profileImage}>
                <UserRound size={30} color="#004E6A" />
              </View>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              <Text style={styles.membership}>{membershipSince}</Text>
            </View>
          </View>
        )}

        {/* Menu for logged-in users */}
        {isLoggedIn && (
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                activeOpacity={0.8}
                onPress={() => item.navigateTo ? navigation.navigate(item.navigateTo) : item.action && item.action()}
              >
                {item.icon}
                <Text style={styles.menuText}>{item.label}</Text>
                <ChevronRight size={20} color="#004E6A" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <CustomDialog
        visible={showLogoutDialog}
        onDismiss={() => setShowLogoutDialog(false)}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        primaryButtonText="Logout"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleLogout}
        type="warning"
        primaryButtonColor="#f79e1b"
        secondaryButtonColor="#666"
      />
    </ContainerWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF6',
  },
  guestHeaderBox: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  loginAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  loginTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#004E6A',
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E0E0E0',
  },
  profileImageWrapper: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#004E6A',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#333',
  },
  membership: {
    color: '#888',
    fontSize: 15,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  menuContainer: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 20,
    color: '#333',
    flex: 1,
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default ProfileScreen;
