import React, { useEffect } from 'react';
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
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  LogOut,
  ChevronRight,
  ArrowLeft,
  UserRound,
  MapPinHouse,
  PackageOpen,
  UserRoundPlus,
  Headset,
  User,
} from 'lucide-react-native';
import { logout } from '../../redux/authSlice';
import SearchBar from '../../components/SearchBar/SearchBar';

const formatDateSince = date => {
  const options = { year: 'numeric', month: 'long' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);
  return `Petcart member since ${formattedDate}`;
};

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const createdAt = user?.createdAt || '2025-07-02T16:36:26.352Z';
  const membershipSince = formatDateSince(createdAt);

  const loggedInMenuItems = [
    {
      label: 'Edit Profile',
      icon: <UserRound size={26} color="#004E6A" />,
      navigateTo: 'ProfileDetailScreen',
    },
    {
      label: 'Address Information',
      icon: <MapPinHouse size={26} color="#004E6A" />,
      navigateTo: 'AddressInfoScreen',
    },
    {
      label: 'My Orders',
      icon: <PackageOpen size={26} color="#004E6A" />,
      navigateTo: 'MyOrderScreen',
    },
    {
      label: 'Invite Friends',
      icon: <UserRoundPlus size={26} color="#004E6A" />,
      navigateTo: 'InviteScreen',
    },
    {
      label: 'Contact Us',
      icon: <Headset size={26} color="#004E6A" />,
      navigateTo: 'ContactUsScreen',
    },
    {
      label: 'Log Out',
      icon: <LogOut size={26} color="#004E6A" />,
      action: () => dispatch(logout()),
    },
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : [];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <SearchBar />
            <TouchableOpacity style={styles.locationButton} activeOpacity={1}>
              <MapPin color="#FFA500" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
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
        <ImageBackground
          source={require('../../assets/images/profilebg.png')}
          style={styles.header}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImage}>
              <UserRound size={30} color="#004E6A" />
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>Hi, {user?.name || 'User'}</Text>
            <Text style={styles.membership}>{membershipSince}</Text>
          </View>
        </ImageBackground>
      )}

      {isLoggedIn && (
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.8}
              onPress={() =>
                item.navigateTo
                  ? navigation.navigate(item.navigateTo)
                  : item.action && item.action()
              }
            >
              {item.icon}
              <Text style={styles.menuText}>{item.label}</Text>
              <ChevronRight size={24} color="#004E6A" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: {
    paddingRight: 15,
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  guestHeaderBox: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  backgroundImage: {
    backgroundColor: '#F59A1199',
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
    fontSize: 22,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#2C2D2E',
    lineHeight: 30,
  },
  membership: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'gotham-rounded-book',
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
    fontSize: 22,
    marginLeft: 20,
    color: '#333',
    flex: 1,
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default ProfileScreen;
