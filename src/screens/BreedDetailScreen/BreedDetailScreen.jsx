import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import Banner from '../../components/Banner/Banner';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH <= 360 || SCREEN_HEIGHT <= 640;

export default function BreedDetailScreen({ route, navigation }) {
  const styles = useMemo(() => makeStyles(isSmallDevice), []);
  const breed = route.params?.breed || {};

  const {
    name = 'Breed',
    hero,
    short,
    facts = {},
    colors = [],
    weight = {},
    height = {},
  } = breed;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={1}
          >
            <ArrowLeft size={isSmallDevice ? 24 : 30} color="#000" />
          </TouchableOpacity>
          <SearchBar style={styles.searchBar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 26 }}>
        {/* Top chips row */}
        <View style={styles.topChipsRow}>
          {['ABOUT', 'DIET', 'TRAINING', 'GROOMING'].map((t, i) => (
            <View key={i} style={styles.topChip}>
              <Text style={styles.topChipText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Heading */}
        <View style={styles.headingRow}>
          <Image
            source={require('../../assets/icons/paw2.png')}
            style={styles.pawsImg}
          />
          <Text style={styles.headingText}>{name.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.heroCard}>
            <View style={styles.heroInner}>
              <Image
                source={
                  typeof breed.hero === 'number'
                    ? breed.hero
                    : { uri: breed.hero }
                }
                style={styles.heroImage}
              />
              <Text style={styles.heroTitle}>
                <Text style={styles.heroTitleEm}>{name}</Text>
                <Text style={styles.heroTitleRest}>
                  {' '}
                  {short || 'A loyal and intelligent companion.'}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.factsCard}>
            <View style={styles.factsInner}>
              <Text style={styles.factTitle}>Life expectancy:</Text>
              <Text style={styles.factValue}>
                {facts.life || '10-12 years'}
              </Text>

              <Text style={[styles.factTitle, { marginTop: 10 }]}>Size:</Text>
              <Text style={styles.factValue}>{facts.size || 'Large'}</Text>

              <Text style={[styles.factTitle, { marginTop: 10 }]}>
                Shedding:
              </Text>
              <Text style={styles.factValue}>{facts.shedding || 'High'}</Text>

              <Text style={[styles.factTitle, { marginTop: 10 }]}>Coat:</Text>
              <Text style={styles.factValue}>
                {facts.coat || 'Straight or wavy'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.specsOuter}>
          <View style={styles.specsCard}>
            {/* Color row */}
            <View style={styles.specUnifiedRow}>
              <View style={styles.specLeft}>
                <Text style={styles.specIcon}>🎨</Text>
                <Text style={styles.specLabel}>Color</Text>
              </View>
              <View style={styles.specRightWrap}>
                {(colors.length
                  ? colors
                  : ['Black & Tan', 'Black', 'White']
                ).map((c, i) => {
                  const isBlackOnly = /black/i.test(c) && !/tan/i.test(c);
                  const useLightText = i === 0 || isBlackOnly; // 0 => Black & Tan, or pure Black
                  const grad =
                    i === 0
                      ? ['#C59155', '#E2A968', '#E0A15E', '#E2A968', '#C59155']
                      : isBlackOnly
                      ? ['#232323', '#343434', '#303030', '#343434', '#232323'] // Black solid
                      : ['#FFFFFF', '#E5E4E4', '#E5E5E5', '#EEEEEE', '#FFFFFF']; // White chip

                  return (
                    <LinearGradient
                      key={`${c}-${i}`}
                      colors={grad}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.colorPillGrad,
                        useLightText && styles.colorPillDarkBorder,
                      ]}
                    >
                      <Text
                        style={[
                          styles.colorText,
                          useLightText && styles.colorTextLight,
                        ]}
                      >
                        {c}
                      </Text>
                    </LinearGradient>
                  );
                })}
              </View>
            </View>

            {/* Weight row */}
            <View style={styles.specUnifiedRow}>
              <View style={styles.specLeft}>
                <Text style={styles.specIcon}>⚖️</Text>
                <Text style={styles.specLabel}>Weight</Text>
              </View>
              <View style={styles.specRightKV}>
                <Text style={styles.kvValue}>
                  {weight.male || '30-40kgs'} (male)
                </Text>
                <Text style={styles.kvValue}>
                  {weight.female || '25-35kgs'} (female)
                </Text>
              </View>
            </View>

            <View style={styles.specUnifiedRow}>
              <View style={styles.specLeft}>
                <Text style={styles.specIcon}>📏</Text>
                <Text style={styles.specLabel}>Height</Text>
              </View>
              <View style={styles.specRightKV}>
                <Text style={styles.kvValue}>
                  {height.male || '61-66cm'} (male)
                </Text>
                <Text style={styles.kvValue}>
                  {height.female || '56-61cm'} (female)
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* ADAPTABILITY */}
        <View style={styles.adaptWrap}>
          {/* Left column */}
          <View style={styles.adaptLeft}>
            <View style={styles.adaptHeadingRow}>
              <Image
                source={require('../../assets/icons/paw2.png')}
                style={styles.pawSmall}
              />
              <Text style={styles.adaptHeading}>ADAPTABILITY</Text>
            </View>

            <Text style={styles.adaptPara}>
              <Text style={styles.italic}>{name}</Text>
              <Text> adapt well to both </Text>
              <Text style={styles.bold}>hot</Text>
              <Text> and </Text>
              <Text style={styles.bold}>cold</Text>
              <Text> climates, thanks to their </Text>
              <Text style={styles.bold}>double</Text>
              <Text> coat.</Text>
            </Text>

            {/* Hot card */}
            <LinearGradient
              colors={['#FFB653', '#FFCB85', '#FFECD3', '#FFCB85', '#FFB653']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tempCard}
            >
              <Image
                source={require('../../assets/icons/hot.png')}
                style={styles.tempIcon}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tempTitle}>Hot weather tolerance:</Text>
                <Text style={styles.tempValue}>
                  up to <Text style={styles.tempValueEm}>28°C</Text>
                </Text>
              </View>
            </LinearGradient>

            {/* Cold card */}
            <LinearGradient
              colors={['#3DAEFF', '#9ED2F5', '#ECF9FF', '#9ED2F5', '#3DAEFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.tempCard, { marginTop: 12 }]}
            >
              <Image
                source={require('../../assets/icons/cold.png')}
                style={styles.tempIcon}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tempTitle}>Cold weather tolerance:</Text>
                <Text style={styles.tempValue}>
                  up to <Text style={styles.tempValueEm}>8°C</Text>
                </Text>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.adaptRight}>
            <Image
              source={
                breed.adaptability?.img
                  ? breed.adaptability.img
                  : require('../../assets/images/german.png')
              }
              style={styles.dogImg}
              resizeMode="cover"
            />
            <View pointerEvents="none" style={styles.dashedOverlay} />
          </View>
        </View>
        <View style={styles.traitsWrap}>
          {/* Heading and Desc */}
          <View style={styles.traitsHeadingRow}>
            <Image
              source={require('../../assets/icons/paw2.png')}
              style={styles.pawSmall}
            />
            <Text style={styles.traitsHeading}>
              {breed.traits?.title || 'TRAITS'}
            </Text>
          </View>
          <Text style={styles.traitsDesc}>{breed.traits?.desc}</Text>
          <View style={styles.traitsContentRow}>
            <View style={styles.traitsAttrBlock}></View>
            <View style={styles.traitsImageCircleWrap}>
              <Image
                source={
                  breed.traits?.image ||
                  require('../../assets/images/german.png')
                }
                style={styles.traitsDogImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.traitsNote}>
            <Text style={styles.traitsNoteRed}>Note:</Text>{' '}
            {breed.traits?.bottomNote}
          </Text>
        </View>
        <Banner />
      </ScrollView>
    </View>
  );
}

const makeStyles = small => {
  const scale = small ? 0.85 : 1;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    headerWrapper: {
      backgroundColor: '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: small ? 8 : 15,
      paddingVertical: small ? 4 : 10,
      gap: small ? 6 : 10,
    },
    backButton: { paddingRight: small ? 8 : 15 },
    searchBar: { flex: 1, height: small ? 32 : 44 },

    topChipsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: small ? 14 : 18,
      paddingTop: small ? 8 : 10,
    },
    topChip: {
      backgroundColor: '#FFF3E0',
      borderColor: '#F5A623',
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: small ? 8 : 10,
      paddingHorizontal: small ? 12 : 14,
      minWidth: ((SCREEN_WIDTH - (small ? 14 : 18) * 2 - 10 * 3) / 4) * scale,
      alignItems: 'center',
    },
    topChipText: {
      color: '#1B1B1B',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 11 : 13,
    },

    headingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: small ? 14 : 18,
      marginTop: small ? 12 : 16,
      gap: small ? 6 : 8,
    },
    pawsImg: {
      width: small ? 34 : 38,
      height: small ? 34 : 38,
      resizeMode: 'contain',
    },
    headingText: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 18 : 22,
      letterSpacing: 0.5,
    },

    row: {
      flexDirection: 'row',
      paddingHorizontal: small ? 14 : 18,
      marginTop: small ? 8 : 12,
      gap: small ? 8 : 12,
    },
    heroCard: {
      flex: 1,
      backgroundColor: '#EBEBEB',
      borderRadius: 16,
      padding: small ? 8 : 10,
      borderWidth: 1,
      borderColor: '#C9D1D9',
    },
    heroInner: {
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: '#6A6868',
      borderRadius: 14,
      padding: small ? 8 : 10,
      alignItems: 'center',
      backgroundColor: '#bfbfbf',
    },
    heroImage: {
      width: '100%',
      height: small ? 150 : 190,
      borderRadius: 12,
      backgroundColor: '#bfbfbf',
    },
    heroTitle: {
      marginTop: small ? 6 : 10,
      fontSize: small ? 12 : 14,
      color: '#2B2B2B',
      lineHeight: small ? 18 : 20,
      textAlign: 'left',
      width: '100%',
      fontFamily: 'Gotham-Rounded-Medium',
    },
    heroTitleEm: { color: '#0E79B2', fontFamily: 'Gotham-Rounded-Bold' },
    heroTitleRest: { color: '#2B2B2B' },

    factsCard: {
      flex: 1,
      backgroundColor: '#E4F4FB',
      borderRadius: 16,
      padding: small ? 8 : 10,
      borderWidth: 1,
      borderColor: '#A2D6EA',
    },
    factsInner: {
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: '#0888B1',
      borderRadius: 14,
      paddingVertical: small ? 8 : 12,
      paddingHorizontal: small ? 10 : 14,
      backgroundColor: '#BADEE9',
    },
    factTitle: {
      color: '#0E2D3A',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 14 : 17,
      marginBottom: small ? 2 : 4,
    },
    factValue: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 15 : 18,
      marginBottom: small ? 2 : 4,
    },

    specsOuter: {
      marginTop: small ? 10 : 14,
      marginHorizontal: small ? 10 : 14,
      backgroundColor: '#FFEFD6',
      borderRadius: 20,
      padding: small ? 8 : 10,
      borderWidth: 1,
      borderColor: '#F9D48F',
      ...(Platform.OS === 'android'
        ? { elevation: 0 }
        : {
            shadowColor: '#F0B850',
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
          }),
    },
    specsCard: {
      backgroundColor: '#FFE3B9',
      borderColor: '#F5A623',
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: small ? 4 : 6,
      paddingHorizontal: small ? 6 : 10,
      borderStyle: 'dashed',
    },

    specUnifiedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: small ? 4 : 8,
    },
    specDivider: { borderBottomWidth: 1, borderBottomColor: '#F5DEB5' },
    specLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: small ? 6 : 8,
      width: 110,
    },
    specIcon: { fontSize: small ? 14 : 16 },
    specLabel: {
      color: '#1B1B1B',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 14 : 16,
    },

    specRightWrap: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: small ? 8 : 10,
    },
    colorPillGrad: {
      paddingVertical: small ? 6 : 10,
      paddingHorizontal: small ? 8 : 14,
      borderRadius: 8,
    },
    colorPillDarkBorder: { borderColor: '#222' },
    colorText: {
      color: '#222',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 11 : 13,
    },
    colorTextLight: { color: '#FFF' },

    specRightKV: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: small ? 4 : 6,
      gap: small ? 6 : 10,
    },
    kvValue: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 11 : 14,
    },

    adaptWrap: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: small ? 14 : 18,
      marginTop: small ? 12 : 16,
      gap: small ? 8 : 12,
    },
    adaptLeft: { flex: 1.1 },
    adaptRight: {
      flex: 0.9,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: small ? 20 : 30,
    },

    adaptHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: small ? 6 : 8,
      marginBottom: small ? 6 : 8,
    },
    pawSmall: {
      width: small ? 32 : 38,
      height: small ? 32 : 38,
      resizeMode: 'contain',
    },
    adaptHeading: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 18 : 22,
      letterSpacing: 0.5,
    },

    adaptPara: {
      color: '#6A6A6A',
      fontSize: small ? 14 : 16,
      lineHeight: small ? 22 : 24,
      marginBottom: small ? 10 : 12,
      fontFamily: 'Gotham-Rounded-Medium',
    },
    italic: {
      fontStyle: 'italic',
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
    },
    bold: { fontFamily: 'Gotham-Rounded-Bold', color: '#111' },

    tempCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingVertical: small ? 10 : 12,
      paddingHorizontal: small ? 12 : 14,
      borderWidth: 1,
      borderColor: '#E6B76F',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      backgroundColor: 'transparent',
    },
    tempIcon: {
      width: small ? 26 : 30,
      height: small ? 26 : 30,
      resizeMode: 'contain',
    },
    tempTitle: {
      color: '#0E2D3A',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: small ? 8 : 12.3,
    },
    tempValue: {
      color: '#0E2D3A',
      fontFamily: 'Gotham-Rounded-Medium',
      fontSize: small ? 12 : 14,
      marginTop: small ? 1 : 2,
    },
    tempValueEm: { color: '#0E79B2', fontFamily: 'Gotham-Rounded-Bold' },

    dogImg: { width: '100%', height: small ? 180 : 240 },
    traitsWrap: {
      marginTop: 24,
      marginBottom: 16,
      paddingHorizontal: 15,
    },
    traitsHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    traitsHeading: {
      color: '#2090B9',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: 21,
      letterSpacing: 0.7,
    },
    traitsDesc: {
      color: '#444',
      fontSize: 15,
      lineHeight: 21,
      marginBottom: 14,
      fontFamily: 'gotham-rounded-book',
    },

    traitsContentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    traitsCircleBreed: {
      position: 'absolute',
      top: 22,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 19,
      color: '#FFF',
      fontFamily: 'Gotham-Rounded-Bold',
      letterSpacing: 2,
    },
    traitsDogImage: {
      width: 400,
      height: 400,
    },

    traitsNote: {
      marginTop: 16,
      fontSize: 15,
      color: '#4E4E4E',
      fontFamily: 'Gotham-Rounded-Medium',
      lineHeight: 19,
    },
    traitsNoteRed: { color: '#ED7A41', fontFamily: 'gotham-rounded-book' },
  });
};
