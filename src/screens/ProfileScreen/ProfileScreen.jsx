import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPinHouse,
  PackageOpen,
  UserRoundPlus,
  Headset,
  UserRound,
  ChevronRight,
  LogOut,
  ArrowLeft,
} from 'lucide-react-native';
import { logout } from '../../redux/authSlice';
import { resetCart } from '../../redux/cartSlice';
import SearchBar from '../../components/SearchBar/SearchBar';
import { persistor } from '../../redux/store';

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const wp = p => (width * p) / 100;
  const hp = p => (height * p) / 100;

  const scale = width / guidelineBaseWidth;
  const vScale = height / guidelineBaseHeight;

  const ms = (size, factor = 0.5) => size + (scale * size - size) * factor;

  const sm = width < 360;
  const md = width >= 360 && width < 768;
  const lg = width >= 768;

  return { width, height, wp, hp, ms, sm, md, lg, scale, vScale };
};

const formatDateSince = date => {
  const options = { year: 'numeric', month: 'long' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);
  return `Petcart member since ${formattedDate}`;
};

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const createdAt = user?.createdAt;
  const membershipSince = createdAt ? formatDateSince(createdAt) : '';

  const { wp, hp, ms, sm, md, lg } = useResponsive();

  const confirmLogout = async () => {
    dispatch(resetCart());
    await persistor.purge();
    dispatch(logout());
  };

  const iconColor = '#004E6A';

  const iconSize = useMemo(() => {
    if (sm) return 22;
    if (lg) return 30;
    return 26;
  }, [sm, lg]);

  const chevronSize = useMemo(() => {
    if (sm) return 18;
    if (lg) return 28;
    return 24;
  }, [sm, lg]);

  const backIconSize = useMemo(() => {
    if (sm) return 24;
    if (lg) return 34;
    return 30;
  }, [sm, lg]);

  const loggedInMenuItems = [
    {
      label: 'Edit Profile',
      icon: <UserRound size={iconSize} color={iconColor} />,
      navigateTo: 'ProfileDetailScreen',
    },
    {
      label: 'Address Information',
      icon: <MapPinHouse size={iconSize} color={iconColor} />,
      navigateTo: 'AddressInfoScreen',
    },
    {
      label: 'My Orders',
      icon: <PackageOpen size={iconSize} color={iconColor} />,
      navigateTo: 'MyOrderScreen',
    },
    {
      label: 'Invite Friends',
      icon: <UserRoundPlus size={iconSize} color={iconColor} />,
      navigateTo: 'InviteScreen',
    },
    {
      label: 'Contact Us',
      icon: <Headset size={iconSize} color={iconColor} />,
      navigateTo: 'ContactUsScreen',
    },
    {
      label: 'Log Out',
      icon: <LogOut size={iconSize} color={iconColor} />,
      action: confirmLogout,
    },
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : [];
  const dyn = useMemo(() => {
    const headerPadV = lg ? hp(3) : sm ? hp(1.8) : hp(2.2);
    const headerPadH = lg ? wp(3) : wp(4);

    return StyleSheet.create({
      container: { flex: 1, backgroundColor: '#FFFFFF' },

      headerWrapper: {
        paddingVertical: clamp(headerPadV, 8, 24),
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: clamp(headerPadH, 10, 24),
        gap: wp(2),
      },
      backButton: { paddingRight: wp(3) },

      guestHeaderBox: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp(3.5),
        marginTop: hp(1.2),
        marginBottom: hp(1.2),
        borderRadius: 12,
        paddingVertical: hp(1.6),
        paddingHorizontal: wp(3.5),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      guestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1),
      },

      avatarWrapper: {
        width: clamp(ms(44), 40, 64),
        height: clamp(ms(44), 40, 64),
        borderRadius: 999,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(3.5),
      },

      loginAction: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
      },
      loginTitle: {
        fontSize: clamp(ms(16), 14, 22),
        fontFamily: 'Gotham-Rounded-Bold',
        color: '#004E6A',
      },

      header: {
        marginBottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4.5),
        paddingTop: hp(2.2),
        paddingBottom: hp(2.2),
        borderBottomWidth: 1.5,
        borderBottomColor: '#E0E0E0',
      },
      backgroundImage: { backgroundColor: '#F59A1199' },

      profileImageWrapper: {
        marginRight: wp(3.5),
        alignItems: 'center',
        justifyContent: 'center',
        width: clamp(ms(56), 48, 84),
        height: clamp(ms(56), 48, 84),
        borderRadius: 999,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#004E6A',
      },

      textWrapper: { flex: 1 },

      name: {
        fontSize: clamp(ms(20), 18, 28),
        fontFamily: 'Gotham-Rounded-Bold',
        color: '#2C2D2E',
        lineHeight: clamp(ms(28), 24, 36),
      },
      membership: {
        color: 'black',
        fontSize: clamp(ms(14), 12, 18),
        fontFamily: 'gotham-rounded-book',
        marginTop: hp(0.3),
      },

      menuContainer: { paddingLeft: wp(3.5), paddingRight: wp(3.5) },

      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: clamp(hp(1.6), 10, 22),
        paddingLeft: wp(1.5),
        borderBottomWidth: 1.5,
        borderBottomColor: '#E0E0E0',
        gap: wp(3),
      },
      menuText: {
        fontSize: clamp(ms(18), 16, 24),
        marginLeft: wp(3),
        color: '#333',
        flex: 1,
        fontFamily: 'Gotham-Rounded-Medium',
      },
    });
  }, [hp, wp, ms, sm, md, lg]);

  return (
    <ScrollView style={dyn.container} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={dyn.headerWrapper}>
        <SafeAreaView>
          <View style={dyn.headerRow}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.goBack()}
              style={dyn.backButton}
            >
              <ArrowLeft size={backIconSize} color="#000" />
            </TouchableOpacity>
            <SearchBar />
          </View>
        </SafeAreaView>
      </View>

      {!isLoggedIn ? (
        <View style={dyn.guestHeaderBox}>
          <View style={dyn.guestRow}>
            <View style={dyn.avatarWrapper}>
              <UserRound size={iconSize} color="#004E6A" />
            </View>
            <TouchableOpacity
              style={dyn.loginAction}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={dyn.loginTitle}>LOGIN / SIGNUP</Text>
              <ChevronRight size={chevronSize} color="#004E6A" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ImageBackground
          source={require('../../assets/images/profilebg.png')}
          style={dyn.header}
          imageStyle={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={dyn.profileImageWrapper}>
            <UserRound size={iconSize} color="#004E6A" />
          </View>
          <View style={dyn.textWrapper}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              style={dyn.name}
            >
              Hi, {user?.name || 'User'}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              style={dyn.membership}
            >
              {membershipSince}
            </Text>
          </View>
        </ImageBackground>
      )}

      {isLoggedIn && (
        <View style={dyn.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={dyn.menuItem}
              activeOpacity={0.8}
              onPress={() =>
                item.navigateTo
                  ? navigation.navigate(item.navigateTo)
                  : item.action()
              }
            >
              {item.icon}
              <Text numberOfLines={1} style={dyn.menuText}>
                {item.label}
              </Text>
              <ChevronRight size={chevronSize} color="#004E6A" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { backgroundColor: '#F59A1199' },
});

export default ProfileScreen;
