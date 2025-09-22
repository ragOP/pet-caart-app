import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import { getCategories } from '../../apis/getCategories';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const underlineAnim = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiResponse = await getCategories();
        const filteredCats = apiResponse.data.data.categories
          .filter(c => c.name === 'Dogs' || c.name === 'Cats')
          .sort((a, b) => (a.name === 'Dogs' ? -1 : 1));
        setCategories(filteredCats);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCategories();
  }, []);

  const TAB_LABELS = categories.map(c => c.name);
  const TAB_COUNT = TAB_LABELS.length;
  const underlineWidth = SCREEN_WIDTH / Math.max(TAB_COUNT, 1);

  const underlineTranslate = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, underlineWidth],
  });

  const handleTabPress = index => {
    if (index < TAB_COUNT) {
      setActiveTab(index);
      Animated.timing(underlineAnim, {
        toValue: index,
        duration: 220,
        useNativeDriver: false,
      }).start();
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
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={30} color="#000" />
          </TouchableOpacity>
          <SearchBar />
        </View>
      </View>
      {TAB_COUNT > 0 && (
        <>
          <View style={styles.tabRow}>
            {TAB_LABELS.map((label, index) => (
              <TouchableOpacity
                key={`tab-${index}`}
                style={styles.tab}
                activeOpacity={0.8}
                onPress={() => handleTabPress(index)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === index && styles.tabTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.underlineContainer}>
            <Animated.View
              style={[
                styles.underline,
                {
                  width: underlineWidth,
                  transform: [{ translateX: underlineTranslate }],
                },
              ]}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: { paddingRight: 15 },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#222',
  },
  underlineContainer: {
    height: 3,
    backgroundColor: '#f6f6f6',
    width: '100%',
  },
  underline: {
    height: 3,
    backgroundColor: '#0888B1',
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderRadius: 2,
  },
});
