import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
const PAWS_ICON = require('../../assets/icons/paw2.png');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH <= 360 || SCREEN_HEIGHT <= 640;
const NUM_COLS = 4;

const DOG_BREEDS = [
  {
    key: 'german-shepherd',
    gridLabel: 'German\nShephard',
    name: 'German Shepherd',
    img: 'https://images.unsplash.com/photo-1649571068605-844f3be0faa1?auto=format&fit=crop&q=80&w=774',
    hero: require('../../assets/images/german.png'), // local
    short: 'The Canine All-Stars - Protecting, Serving, and Winning Hearts',
    facts: {
      life: '10-12 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Straight or wavy',
    },
    colors: ['Black & Tan', 'Black', 'White'],
    weight: { male: '30-40kgs', female: '25-35kgs' },
    height: { male: '61-66cm', female: '56-61cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: require('../../assets/images/german2.png'),
      desc: {
        breedItalic: 'German Shepherds',
        mid: ' adapt well to both ',
        hotBold: 'hot',
        andText: ' and ',
        coldBold: 'cold',
        tail: ' climates, thanks to their ',
        doubleBold: 'double',
        tail2: ' coat.',
      },
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '28°C',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '8°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image: require('../../assets/images/germantraits.png'), // traits dog cutout, circle bg
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      attributes: [
        { score: 4, title: 'Playfulness' },
        { score: 4, title: 'Friendliness' },
        { score: 4, title: 'Good With Kids' },
        { score: 4, title: 'Good With Other Dogs' },
        { score: 5, title: 'Energy Level' },
        { score: 4, title: 'Barking Tendencies' },
        { score: 4, title: 'First Time Ownership' },
      ],
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
  },
  {
    key: 'labrador-retriever',
    gridLabel: 'Labrador\nRetriever',
    name: 'Labrador Retriever',
    img: 'https://images.unsplash.com/photo-1537204696486-967f1b7198c8?auto=format&fit=crop&q=60&w=900',
    hero: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200',
    short: 'Friendly, outgoing, and high-spirited family companions.',
    facts: {
      life: '12-13 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Short, dense',
    },
    colors: ['Yellow', 'Black', 'Chocolate'],
    weight: { male: '29-36kgs', female: '25-32kgs' },
    height: { male: '57-62cm', female: '55-60cm' },
  },
  {
    key: 'doberman-pinscher',
    gridLabel: 'Doberman\nPinscher',
    name: 'Doberman Pinscher',
    img: 'https://images.unsplash.com/photo-1588095210434-3a062445f093?auto=format&fit=crop&q=60&w=900',
    hero: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200',
    short: 'Alert, fearless, and loyal guardians with elegant build.',
    facts: {
      life: '10-12 years',
      size: 'Large',
      shedding: 'Moderate',
      coat: 'Short, smooth',
    },
    colors: ['Black & Rust', 'Red & Rust', 'Blue & Rust'],
    weight: { male: '34-45kgs', female: '27-41kgs' },
    height: { male: '68-72cm', female: '63-68cm' },
  },
  {
    key: 'american-pit-bull',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },

  // Repeat some for grid fill (can duplicate with same detail)
  {
    key: 'doberman-pinscher-2',
    gridLabel: 'Doberman\nPinscher',
    name: 'Doberman Pinscher',
    img: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200',
    short: 'Alert, fearless, and loyal guardians with elegant build.',
    facts: {
      life: '10-12 years',
      size: 'Large',
      shedding: 'Moderate',
      coat: 'Short, smooth',
    },
    colors: ['Black & Rust', 'Red & Rust', 'Blue & Rust'],
    weight: { male: '34-45kgs', female: '27-41kgs' },
    height: { male: '68-72cm', female: '63-68cm' },
  },
  {
    key: 'pit-bull-2',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
  {
    key: 'pit-bull-3',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1602067340370-bdcebe8b7617?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
  {
    key: 'pit-bull-4',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
  {
    key: 'pit-bull-5',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1534367610401-9f75f7f93763?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
  {
    key: 'pit-bull-6',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
  {
    key: 'pit-bull-7',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
  {
    key: 'pit-bull-8',
    gridLabel: 'American\nPit Bull',
    name: 'American Pit Bull',
    img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200',
    hero: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=1200',
    short: 'Strong, affectionate, and people-oriented companions.',
    facts: {
      life: '12-14 years',
      size: 'Medium',
      shedding: 'Low',
      coat: 'Short, glossy',
    },
    colors: ['Brindle', 'Blue', 'White'],
    weight: { male: '16-27kgs', female: '13-23kgs' },
    height: { male: '45-53cm', female: '43-50cm' },
  },
];

export default function BreedScreen({ navigation }) {
  const styles = useMemo(() => makeStyles(isSmallDevice), []);
  const openBreed = breed => {
    navigation.navigate('BreedDetailScreen', { breed }); // pass full object
  };

  const renderBreed = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cell}
      onPress={() => openBreed(item)}
    >
      <LinearGradient
        colors={['#FFE9C8', '#FFF4E8']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.circle}
      >
        <Image source={{ uri: item.img }} style={styles.avatar} />
      </LinearGradient>
      <Text style={styles.cellText} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
      <View style={styles.dogChipRow}>
        <View style={styles.dogChip}>
          <Text style={styles.dogIcon}>🐶</Text>
          <Text style={styles.dogChipText}>DOGS</Text>
        </View>
      </View>
      <View style={styles.headingRow}>
        <Image source={PAWS_ICON} style={styles.pawsImg} />
        <Text style={styles.heading}>
          <Text style={styles.headingOrange}> Shop </Text>
          <Text style={styles.headingBlue}>By Breed</Text>
        </Text>
      </View>

      <FlatList
        data={DOG_BREEDS}
        key={`grid-${NUM_COLS}`}
        numColumns={NUM_COLS}
        renderItem={renderBreed}
        keyExtractor={(_, idx) => String(idx)}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const makeStyles = small => {
  const H_PAD = 18;
  const cellW = (SCREEN_WIDTH - H_PAD * 2) / 4;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    headerWrapper: {
      backgroundColor: '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: small ? 10 : 15,
      paddingVertical: small ? 6 : 10,
      gap: small ? 6 : 10,
    },
    backButton: { paddingRight: small ? 8 : 15 },
    searchBar: { flex: 1, height: small ? 36 : 44 },

    dogChipRow: { alignItems: 'center', paddingTop: 8 },
    dogChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
      paddingHorizontal: 16,
      backgroundColor: '#FFF6E8',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#F5A623',
    },
    dogIcon: { fontSize: 16 },
    dogChipText: {
      fontSize: 16,
      color: '#222',
      fontFamily: 'Gotham-Rounded-Bold',
    },

    headingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 22,
      marginTop: 10,
    },
    pawsImg: {
      width: 38,
      height: 38,

      resizeMode: 'contain',
    },
    heading: { flexDirection: 'row' },
    headingOrange: {
      color: '#F5A623',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: 20,
    },
    headingBlue: {
      color: '#026AA7',
      fontFamily: 'Gotham-Rounded-Bold',
      fontSize: 20,
    },

    gridContent: { paddingHorizontal: H_PAD, paddingBottom: 24, paddingTop: 6 },
    cell: { width: cellW, alignItems: 'center', marginTop: 14 },
    circle: {
      width: small ? 74 : 84,
      height: small ? 74 : 84,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#F3D6A8',
    },
    avatar: {
      width: small ? 62 : 76,
      height: small ? 62 : 76,
      borderRadius: 999,
      backgroundColor: '#fff',
      resizeMode: 'cover',
    },
    cellText: {
      textAlign: 'center',
      marginTop: 6,
      color: '#2C2C2C',
      fontSize: small ? 12 : 12.5,
      lineHeight: small ? 16 : 17,
      fontFamily: 'Gotham-Rounded-Medium',
    },
  });
};
