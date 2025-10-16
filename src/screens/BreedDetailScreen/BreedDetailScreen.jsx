import React, { useMemo, useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const getSizeTier = () => {
  if (SCREEN_WIDTH <= 320) return 'small';
  if (SCREEN_WIDTH <= 360) return 'compact';
  return 'normal';
};

export default function BreedDetailScreen({ route, navigation }) {
  const tier = getSizeTier();
  const styles = useMemo(() => makeStyles(tier), [tier]);
  const breed = route.params?.breed || {};

  const {
    name = 'Breed',
    short,
    facts = {},
    colors = [],
    weight = {},
    height = {},
  } = breed;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(2);

  const imageY = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
  };

  const handleTextReady = ({ nativeEvent: { lines } }) => {
    if (!isReady) {
      const canExpand = lines.length > 3;
      setNumberOfLines(canExpand ? 3 : lines.length);
      setIsReady(true);
    }
  };
  const COLOR_MAP = (label, index) => {
    const isBlackOnly = /black/i.test(label) && !/tan/i.test(label);
    const isWhite = /white/i.test(label);
    const isBlackTan = /black/i.test(label) && /tan/i.test(label);

    if (isBlackTan || index === 0) {
      return { base: '#d29f5d', shine: 'rgba(255, 230, 170, 0.28)' }; // gold shine
    }
    if (isBlackOnly) {
      return { base: '#242726', shine: 'rgba(200, 200, 200, 0.22)' }; // silver shine
    }
    if (isWhite) {
      return { base: '#e5e5e5', shine: 'rgba(255, 255, 255, 0.45)' }; // soft highlight
    }
    return { base: '#e5e5e5', shine: 'rgba(255, 255, 255, 0.35)' };
  };
  const displayText = short || 'A loyal and intelligent companion.';
  function TempCard({ colors, start = [0, 0], end = [1, 1], style, children }) {
    return (
      <Svg height={style.height} width="100%" style={style}>
        <Defs>
          <SvgLinearGradient
            id="grad"
            x1={`${start[0] * 100}%`}
            y1={`${start[1] * 100}%`}
            x2={`${end[0] * 100}%`}
            y2={`${end[1] * 100}%`}
          >
            {colors.map((c, i) => (
              <Stop
                key={i}
                offset={`${(i / (colors.length - 1)) * 100}%`}
                stopColor={c}
                stopOpacity="1"
              />
            ))}
          </SvgLinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="16"
          fill="url(#grad)"
        />
      </Svg>
    );
  }
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
            <ArrowLeft size={styles.iconSize} color="#000" />
          </TouchableOpacity>
          <SearchBar style={styles.searchBar} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: styles.pagePaddingBottom }}
      >
        <View style={styles.topChipsRow}>
          {['ABOUT', 'DIET', 'TRAINING', 'GROOMING'].map((t, i) => (
            <View key={i} style={styles.topChip}>
              <Text style={styles.topChipText}>{t}</Text>
            </View>
          ))}
        </View>
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
              <Animated.View
                style={[
                  styles.heroImageContainer,
                  { transform: [{ translateY: imageY }] },
                ]}
              >
                <Image
                  source={
                    typeof breed.hero === 'number'
                      ? breed.hero
                      : { uri: breed.hero }
                  }
                  style={styles.heroImage}
                />
              </Animated.View>

              <Text
                onTextLayout={handleTextReady}
                numberOfLines={
                  isReady ? (isExpanded ? undefined : numberOfLines) : 3
                }
                style={styles.heroDescription}
                ellipsizeMode="tail"
              >
                {displayText}
              </Text>

              {isReady && numberOfLines === 3 && (
                <TouchableOpacity
                  onPress={toggleExpand}
                  style={styles.readMoreButton}
                >
                  <Text style={styles.readMoreText}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.factsCard}>
            <View style={styles.factsInner}>
              <Text style={styles.factTitle}>Life expectancy:</Text>
              <Text style={styles.factValue}>
                {facts.life || '10-12 years'}
              </Text>

              <Text style={[styles.factTitle, styles.factTitleSpaced]}>
                Size:
              </Text>
              <Text style={styles.factValue}>{facts.size || 'Large'}</Text>

              <Text style={[styles.factTitle, styles.factTitleSpaced]}>
                Shedding:
              </Text>
              <Text style={styles.factValue}>{facts.shedding || 'High'}</Text>

              <Text style={[styles.factTitle, styles.factTitleSpaced]}>
                Coat:
              </Text>
              <Text style={styles.factValue}>
                {facts.coat || 'Straight or wavy'}
              </Text>
            </View>
          </View>
        </View>

        {/* Specs */}
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
                  const useLightText = i === 0 || isBlackOnly;
                  const palette = COLOR_MAP(c, i);

                  return (
                    <View
                      key={`${c}-${i}`}
                      style={[
                        styles.colorPillBase,
                        { backgroundColor: palette.base },
                        useLightText && styles.colorPillDarkBorder,
                      ]}
                    >
                      {/* Top soft highlight line */}
                      <View style={styles.topHighlight} />

                      {/* Diagonal shine overlay for metallic/gloss feel */}
                      <View
                        pointerEvents="none"
                        style={[
                          styles.diagonalShine,
                          { backgroundColor: palette.shine },
                        ]}
                      />

                      <Text
                        style={[
                          styles.colorText,
                          useLightText && styles.colorTextLight,
                        ]}
                        numberOfLines={1}
                      >
                        {c}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Weight */}
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

            {/* Height */}
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

        {/* Adaptability */}
        <View style={styles.adaptWrap}>
          <View style={styles.adaptLeft}>
            <View style={styles.adaptHeadingRow}>
              <Image
                source={require('../../assets/icons/paw2.png')}
                style={styles.pawSmall}
              />
              <Text style={styles.adaptHeading}>ADAPTABILITY</Text>
            </View>

            <Text style={styles.adaptPara}>
              {breed.adaptability?.description ||
                'This breed is known for its adaptability to various environments.'}{' '}
            </Text>

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

            <LinearGradient
              colors={['#3DAEFF', '#9ED2F5', '#ECF9FF', '#9ED2F5', '#3DAEFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.tempCard, { marginTop: styles.tempCardGap }]}
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

        {/* Traits */}
        <View style={styles.traitsWrap}>
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
            <View style={styles.traitsAttrBlock} />
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

        {/* Diet */}
        <View style={styles.dietHeaderRow}>
          <Image
            source={require('../../assets/icons/paw2.png')}
            style={styles.pawSmall}
          />
          <Text style={styles.dietHeader}>{breed.diet?.title || 'DIET'}</Text>
        </View>

        <View style={styles.dietWrap}>
          <View style={styles.dietImageCol}>
            <View style={styles.dietOutline}>
              <Image
                source={
                  breed.diet?.image || require('../../assets/images/german.png')
                }
                style={styles.dietDogImg}
                resizeMode="contain"
              />
              <View pointerEvents="none" style={styles.dietDashedOverlay} />
            </View>
          </View>
          <View style={styles.dietContentCol}>
            <Text style={styles.dietDesc}>
              {breed.diet?.descBlocks?.map((block, i) => (
                <Text
                  key={i}
                  style={
                    block.style === 'bold'
                      ? styles.dietDescBold
                      : block.style === 'italicBlue'
                      ? styles.dietDescItalicBlue
                      : styles.dietDescNormal
                  }
                >
                  {block.text}
                </Text>
              ))}
            </Text>
          </View>
        </View>

        {breed.diet?.tips?.map((tip, idx) => {
          const orientation = tip.orientation || 'left';
          return (
            <View
              key={idx}
              style={[
                styles.tipCardWrap,
                {
                  flexDirection:
                    orientation === 'right' ? 'row-reverse' : 'row',
                },
              ]}
            >
              <View style={[styles.blueOuter, { position: 'relative' }]}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeNum}>{tip.step}</Text>
                </View>
                <View style={styles.blueInnerDashed}>
                  <Text style={styles.tipTitleBlue}>{tip.title}</Text>
                  <Text style={styles.tipDescBlue}>{tip.desc}</Text>
                </View>
              </View>

              <View style={styles.tipFoodCol}>
                <Image source={tip.foodImage} style={styles.tipFoodImg} />
              </View>
            </View>
          );
        })}

        {/* Home cooked wheel */}
        <View style={styles.homeCookedWrap}>
          <View style={styles.homeCookedHeadRow}>
            <Image
              source={require('../../assets/icons/paw2.png')}
              style={styles.pawSmall}
            />
            <Text style={styles.homeCookedHeadText}>
              {breed.diet?.homecooked?.title ??
                'Home‑cooked food must contain:'}
            </Text>
          </View>

          <View style={styles.homeCookedRow}>
            <View style={styles.homeCookedLeft}>
              <Text style={styles.homeCookedNote}>
                {breed.diet?.leftNote ??
                  'Preparing home‑cooked meals may be time consuming and nutritionally incomplete, consider adding food toppers or supplements to make up for the lack of nutrients.'}
              </Text>
            </View>

            <View style={styles.homeCookedRight}>
              {breed.diet?.wheelBg ? (
                <View style={styles.wheelBox} />
              ) : (
                <View style={styles.wheelBox}>
                  <Image
                    source={
                      breed.diet?.wheelCenterImage ||
                      require('../../assets/images/wheelgerman.png')
                    }
                    style={styles.wheelImage}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Training */}
        <View style={styles.dietHeaderRow}>
          <Image
            source={require('../../assets/icons/paw2.png')}
            style={styles.pawSmall}
          />
          <Text style={styles.dietHeader}>
            {breed.training?.title || 'TRAINING'}
          </Text>
        </View>

        <View style={styles.dietWrap}>
          <View style={styles.dietImageCol}>
            <View style={styles.dietOutline}>
              <Image
                source={
                  breed.training?.image ||
                  require('../../assets/images/german.png')
                }
                style={styles.dietDogImg}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.dietContentCol}>
            <Text style={styles.dietDesc}>
              {breed.training?.descBlocks?.map((block, i) => (
                <Text
                  key={i}
                  style={
                    block.style === 'bold'
                      ? styles.dietDescBold
                      : block.style === 'italicBlue'
                      ? styles.dietDescItalicBlue
                      : styles.dietDescNormal
                  }
                >
                  {block.text}
                </Text>
              ))}
            </Text>
          </View>
        </View>

        {breed.training?.tips?.map((tip, idx) => {
          const orientation = tip.orientation || 'left';
          return (
            <View
              key={idx}
              style={[
                styles.tipCardWrap,
                {
                  flexDirection:
                    orientation === 'right' ? 'row-reverse' : 'row',
                },
              ]}
            >
              <View style={[styles.blueOuter, { position: 'relative' }]}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeNum}>{tip.step}</Text>
                </View>
                <View style={styles.blueInnerDashed}>
                  <Text style={styles.tipTitleBlue}>{tip.title}</Text>
                  <Text style={styles.tipDescBlue}>{tip.desc}</Text>
                </View>
              </View>

              <View style={styles.tipFoodCol}>
                <Image source={tip.foodImage} style={styles.tipFoodImg} />
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacer} />

        {/* Grooming */}
        <View style={styles.dietHeaderRow}>
          <Image
            source={require('../../assets/icons/paw2.png')}
            style={styles.pawSmall}
          />
          <Text style={styles.dietHeader}>
            {breed.grooming?.title || 'GROOMING'}
          </Text>
        </View>

        <View style={styles.dietWrap}>
          <View style={styles.dietImageCol}>
            <View style={styles.dietOutline}>
              <Image
                source={
                  breed.grooming?.image ||
                  require('../../assets/images/german.png')
                }
                style={styles.dietDogImg}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.dietContentCol}>
            <Text style={styles.dietDesc}>
              {breed.grooming?.descBlocks?.map((block, i) => (
                <Text
                  key={i}
                  style={
                    block.style === 'bold'
                      ? styles.dietDescBold
                      : block.style === 'italicBlue'
                      ? styles.dietDescItalicBlue
                      : styles.dietDescNormal
                  }
                >
                  {block.text}
                </Text>
              ))}
            </Text>
          </View>
        </View>

        {breed.grooming?.tips?.map((tip, idx) => {
          const orientation = tip.orientation || 'left';
          return (
            <View
              key={idx}
              style={[
                styles.tipCardWrap,
                {
                  flexDirection:
                    orientation === 'right' ? 'row-reverse' : 'row',
                },
              ]}
            >
              <View style={[styles.blueOuter, { position: 'relative' }]}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeNum}>{tip.step}</Text>
                </View>
                <View style={styles.blueInnerDashed}>
                  <Text style={styles.tipTitleBlue}>{tip.title}</Text>
                  <Text style={styles.tipDescBlue}>{tip.desc}</Text>
                </View>
              </View>

              <View style={styles.tipFoodCol}>
                <Image source={tip.foodImage} style={styles.tipFoodImg} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const makeStyles = tier => {
  const isSmall = tier === 'small';
  const isCompact = tier === 'compact';
  const baseScale = isSmall ? 0.78 : isCompact ? 0.9 : 1;
  const fontScale = isSmall ? 0.84 : isCompact ? 0.92 : 1;
  const fs = v => Math.max(10, Math.round(v * fontScale));
  const sz = v => Math.max(2, Math.round(v * baseScale));

  const horizontalPad = isSmall ? 10 : isCompact ? 12 : 15;
  const iconSize = isSmall ? 22 : isCompact ? 26 : 30;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    iconSize,
    pagePaddingBottom: sz(24),

    headerWrapper: {
      backgroundColor: '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalPad,
      paddingVertical: isSmall ? 4 : isCompact ? 6 : 10,
      gap: sz(8),
    },
    backButton: { paddingRight: sz(12) },
    searchBar: { flex: 1, height: isSmall ? 30 : isCompact ? 36 : 44 },

    topChipsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: horizontalPad,
      paddingTop: sz(8),
      gap: sz(6),
    },
    topChip: {
      backgroundColor: '#FFF3E0',
      borderColor: '#F5A623',
      borderWidth: 1,
      borderRadius: sz(10),
      paddingVertical: sz(8),
      paddingHorizontal: sz(10),
      minWidth:
        ((SCREEN_WIDTH - horizontalPad * 2 - sz(8) * 3) / 4) *
        (isSmall ? 0.9 : isCompact ? 0.95 : 1),
      alignItems: 'center',
    },
    topChipText: {
      color: '#1B1B1B',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(12),
    },

    headingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalPad,
      marginTop: sz(12),
      gap: sz(6),
    },
    pawsImg: {
      width: sz(32),
      height: sz(32),
      resizeMode: 'contain',
    },
    headingText: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(20),
      letterSpacing: 0.5,
    },

    row: {
      flexDirection: 'row',
      paddingHorizontal: horizontalPad,
      marginTop: sz(10),
      gap: sz(10),
    },
    heroCard: {
      flex: 1,
      backgroundColor: '#EBEBEB',
      borderRadius: sz(14),
      padding: sz(8),
      borderWidth: 1,
      borderColor: '#C9D1D9',
    },
    heroInner: {
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: '#6A6868',
      borderRadius: sz(12),
      padding: sz(8),
      alignItems: 'center',
      backgroundColor: '#bfbfbf',
    },
    heroImageContainer: {
      width: '100%',
    },
    heroImage: {
      width: '100%',
      height: isSmall ? 130 : isCompact ? 160 : 170,
    },

    heroDescription: {
      fontSize: fs(13),
      color: '#2B2B2B',
      lineHeight: Math.round(fs(13) * 1.4),
      textAlign: 'left',
      width: '100%',
      fontFamily: 'Gotham-Rounded-Medium',
      // removed bottom offset to avoid extra gap
    },
    readMoreButton: {
      paddingVertical: sz(4),
      alignSelf: 'flex-start',
      marginTop: sz(4),
      // removed bottom offset
    },
    readMoreText: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(12),
    },

    factsCard: {
      flex: 1,
      backgroundColor: '#E4F4FB',
      borderRadius: sz(14),
      padding: sz(8),
      borderWidth: 1,
      borderColor: '#A2D6EA',
    },
    factsInner: {
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: '#0888B1',
      borderRadius: sz(12),
      paddingVertical: sz(10),
      paddingHorizontal: sz(10),
      backgroundColor: '#BADEE9',
    },
    factTitle: {
      color: '#0E2D3A',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(15),
      marginBottom: sz(2),
    },
    factTitleSpaced: { marginTop: sz(8) },
    factValue: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(16),
      marginBottom: sz(2),
    },

    specsOuter: {
      marginTop: sz(12),
      marginHorizontal: sz(10),
      backgroundColor: '#FFEFD6',
      borderRadius: sz(18),
      padding: sz(8),
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
      borderRadius: sz(14),
      paddingVertical: sz(4),
      paddingHorizontal: sz(8),
      borderStyle: 'dashed',
    },

    specUnifiedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: sz(6),
    },
    specLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sz(6),
      width: isSmall ? 96 : isCompact ? 104 : 110,
    },
    specIcon: { fontSize: fs(14) },
    specLabel: {
      color: '#1B1B1B',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(14),
    },

    specRightWrap: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: sz(8),
    },
    colorPillBase: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 32,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    colorPillDarkBorder: {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.28)',
    },
    colorText: {
      fontSize: 13,
      color: '#222',
    },
    colorTextLight: {
      color: '#fff',
    },

    diagonalShine: {
      position: 'absolute',
      width: '140%',
      height: '140%',
      top: '-20%',
      left: '-20%',
      transform: [{ rotate: '20deg' }],
      borderRadius: 4,
      opacity: 0.5,
    },
    specRightKV: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: sz(4),
      gap: sz(6),
    },
    kvValue: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(12),
    },

    adaptWrap: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: horizontalPad,
      marginTop: sz(14),
      gap: sz(10),
    },
    adaptLeft: { flex: 1.1 },
    adaptRight: {
      flex: 0.9,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: sz(20),
    },

    adaptHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sz(6),
      marginBottom: sz(6),
    },
    pawSmall: {
      width: sz(32),
      height: sz(32),
      resizeMode: 'contain',
      marginRight: sz(2),
    },
    adaptHeading: {
      color: '#0E79B2',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(20),
      letterSpacing: 0.5,
    },

    adaptPara: {
      color: '#6A6A6A',
      fontSize: fs(13),
      lineHeight: Math.round(fs(14) * 1.5),
      marginBottom: sz(10),
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
      borderRadius: sz(8),
      paddingVertical: sz(10),
      paddingHorizontal: sz(12),

      borderColor: '#E6B76F',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      backgroundColor: 'transparent',
      ...Platform.select({
        ios: {
          height: 50,
          paddingVertical: 0,
          right: 14,
          width: 220,
        },
      }),
    },

    tempIcon: {
      width: sz(28),
      height: sz(28),
      resizeMode: 'contain',
    },
    tempTitle: {
      color: '#0E2D3A',
      fontFamily: 'Gotham-Rounded-Medium',
      fontSize: fs(10.3),
      ...Platform.select({
        ios: {
          fontSize: fs(12),
        },
      }),
    },
    tempValue: {
      color: '#0E2D3A',
      fontFamily: 'Gotham-Rounded-Medium',
      fontSize: fs(12),
      marginTop: sz(2),
      ...Platform.select({
        ios: {
          fontSize: fs(14),
        },
      }),
    },
    tempValueEm: { color: '#0E79B2', fontFamily: 'Gotham-Rounded-Bold' },
    tempCardGap: sz(10),

    dogImg: { width: '100%', height: isSmall ? 160 : isCompact ? 200 : 240 },

    traitsWrap: {
      marginTop: sz(22),
      marginBottom: sz(14),
      paddingHorizontal: horizontalPad,
    },
    traitsHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sz(6),
      marginBottom: sz(6),
    },
    traitsHeading: {
      color: '#2090B9',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(20),
      letterSpacing: 0.7,
    },
    traitsDesc: {
      color: '#444',
      fontSize: fs(14),
      lineHeight: Math.round(fs(14) * 1.5),
      marginBottom: sz(12),
      fontFamily: 'gotham-rounded-book',
    },

    traitsContentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    traitsDogImage: {
      width: isSmall ? 280 : isCompact ? 340 : 390,
      height: isSmall ? 280 : isCompact ? 340 : 390,
    },

    traitsNote: {
      marginTop: sz(14),
      fontSize: fs(14),
      color: '#4E4E4E',
      fontFamily: 'Gotham-Rounded-Medium',
      lineHeight: Math.round(fs(14) * 1.35),
    },
    traitsNoteRed: { color: '#ED7A41', fontFamily: 'gotham-rounded-book' },

    dietWrap: {
      marginTop: sz(24),
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      gap: sz(4),
      paddingHorizontal: horizontalPad - 2,
    },
    dietImageCol: { flex: 1, minWidth: 120 },
    dietOutline: { alignItems: 'center', position: 'relative', width: '100%' },
    dietDogImg: {
      width: isSmall ? 230 : isCompact ? 260 : 280,
      height: isSmall ? 180 : isCompact ? 200 : 220,
    },

    dietContentCol: { flex: 1.3, justifyContent: 'center', marginLeft: sz(4) },
    dietHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sz(6),
      marginBottom: sz(2),
      paddingHorizontal: horizontalPad,
    },
    dietHeader: {
      color: '#2090B9',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(20),
      letterSpacing: 0.5,
    },
    dietDesc: {
      fontSize: fs(14),
      color: '#666',
      lineHeight: Math.round(fs(14) * 1.55),
      fontFamily: 'Gotham-Rounded-Medium',
      marginTop: sz(6),
    },
    dietDescBold: { fontWeight: 'bold', color: '#222' },
    dietDescItalicBlue: {
      fontStyle: 'italic',
      color: '#1876A4',
      fontFamily: 'Gotham-Rounded-Bold',
    },
    dietDescNormal: {},

    tipCardWrap: {
      flexDirection: 'row',
      marginTop: sz(20),
      gap: sz(10),
    },
    blueOuter: {
      flex: 1,
      backgroundColor: '#E4F4FB',
      borderRadius: sz(12),
      padding: sz(8),
      ...(Platform.OS === 'android'
        ? { elevation: 2 }
        : {
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }),
      paddingLeft: sz(44),
      minHeight: isSmall ? 110 : 120,
    },
    stepBadge: {
      position: 'absolute',
      top: sz(6),
      left: sz(8),
      width: sz(34),
      height: sz(34),
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepBadgeNum: {
      color: '#F0A42B',
      fontSize: fs(26),
      fontFamily: 'Gotham-Rounded-Bold',
      lineHeight: fs(26),
    },
    blueInnerDashed: {
      flex: 1,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: '#0B86B5',
      borderRadius: sz(12),
      paddingVertical: sz(12),
      paddingHorizontal: sz(12),
      backgroundColor: '#CFEAF6',
    },
    tipTitleBlue: {
      color: '#083B4C',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(18),
      lineHeight: Math.round(fs(18) * 1.4),
      marginBottom: sz(6),
    },
    tipDescBlue: {
      color: '#07384A',
      fontFamily: 'Gotham-Rounded-Medium',
      fontSize: fs(14),
      lineHeight: Math.round(fs(14) * 1.45),
    },

    tipFoodCol: {
      justifyContent: 'center',
      margin: sz(6),
    },
    tipFoodImg: {
      width: isSmall ? 100 : isCompact ? 140 : 160,
      height: isSmall ? 100 : isCompact ? 140 : 160,
      resizeMode: 'contain',
      marginTop: sz(12),
      marginRight: sz(1),
    },

    homeCookedWrap: { marginTop: sz(20), paddingHorizontal: horizontalPad },
    homeCookedHeadRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sz(6),
      marginBottom: sz(6),
    },
    homeCookedHeadText: {
      color: '#2090B9',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: fs(19),
    },
    homeCookedRow: { flexDirection: 'row', gap: sz(12), alignItems: 'center' },
    homeCookedLeft: { flex: 1.05 },
    homeCookedNote: {
      color: '#505050',
      fontSize: fs(14),
      lineHeight: Math.round(fs(14) * 1.55),
      fontFamily: 'Gotham-Rounded-Medium',
    },
    homeCookedRight: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    wheelBox: {
      width: isSmall ? 200 : isCompact ? 220 : 220,
      height: isSmall ? 200 : isCompact ? 220 : 220,
      alignItems: 'center',
      justifyContent: 'center',
    },
    wheelImage: { width: '98%', height: '100%', resizeMode: 'cover' },

    bottomSpacer: { marginTop: sz(22) },
  });
};
