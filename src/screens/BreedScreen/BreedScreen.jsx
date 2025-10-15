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
    slug: 'german-shepherd',
    name: 'German Shepherd',
    img: 'https://images.unsplash.com/photo-1649571068605-844f3be0faa1?auto=format&fit=crop&q=80&w=774',
    hero: require('../../assets/images/german.png'), // local
    short:
      "The German Shepherd is one of the world's most versatile and intelligent dog breeds—loyal, confident, and highly trainable. Known for their courage, devotion, and protective nature, German Shepherds excel in working roles, family environments, and as service dogs.",
    category: 'dogs',
    facts: {
      life: '9-13 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Confident, Courageous, Smart',
    },
    colors: ['Black & Tan', 'Black', 'White'],
    weight: { male: '30-40kgs', female: '25-35kgs' },
    height: { male: '61-66cm', female: '56-61cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: require('../../assets/images/german2.png'),
      description:
        'German Shepherds adapt well to both hot and cold climates, thanks to their double coat.',
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
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image: require('../../assets/images/germandiet.png'),
      descBlocks: [
        { text: 'German Shepherds', style: 'italicBlue' },
        {
          text: ' adapt well to both hot and cold climates, thanks to their ',
          style: '',
        },
        { text: 'double coat', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'German Shepherds have a high energy level and require a high protein diet to support their active lifestyle. Look for a diet with at least 18-25% protein for adult German Shepherds and even more for growing puppies.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'), // local food image
          foodLabel: 'Chicken Based Food',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'German Shepherds have a sensitive stomach and should avoid food that includes fillers such as wheat and soy that are difficult to digest and may cause allergies.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Grain-Free Food',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids',
          desc: 'German Shepherds have a thick double coat that requires a diet which includes essential fatty acids to keep them healthy and shiny. Look for food that contains Omega-3 and Omega-6 fatty acids.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Fish Oil Supplement',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your German Shepherd's age, as puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Puppy Food',
          orientation: 'left',
        },
      ],
      homecooked: {
        title: 'Home‑cooked food must contain:',
        leftNote:
          'Preparing home‑cooked meals may be time consuming and nutritionally incomplete, consider adding food toppers or supplements to make up for the lack of nutrients.',
        wheelCenterImage: require('../../assets/images/wheelgerman.png'),
      },
    },
    training: {
      title: 'TRAINING',
      icon: require('../../assets/icons/paw2.png'),
      image: require('../../assets/images/germantraining.png'),
      descBlocks: [
        { text: 'German Shepherds', style: 'italicBlue' },
        { text: ' require ', style: '' },
        {
          text: 'regular exercise, proper grooming,socialization, and consistent training',
          style: 'bold',
        },
        { text: ' to maintain their physical health ', style: '' },
        {
          text: 'and mental well-being.',
          style: 'bold',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'German Shepherds require regular physical exercise. Include activities such as running, playing fetch, swimming, agility training, or hiking in their training regime.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'), // local food image
          foodLabel: 'Chicken Based Food',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'German Shepherds require mental stimulation to keep their minds active. Activities such as scent-retention games and puzzle toys are great options to keep them stimulated.',
          boxColor: '#DFF1FB',
          foodLabel: 'Chicken Based Food',
          foodImage: require('../../assets/images/dummyfood.png'),
          orientation: 'left',
        },
      ],
    },
    grooming: {
      title: 'GROOMING',
      icon: require('../../assets/icons/paw2.png'),
      image: require('../../assets/images/germangrooms.png'),
      descBlocks: [
        { text: 'German Shepherds', style: 'italicBlue' },
        { text: ' have relatively ', style: '' },
        {
          text: 'low grooming needs despite having dense and medium-length coats.',
          style: 'bold',
        },
        {
          text: ' Here are some essential tips to ensure they shine.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'German Shepherds should be regularly brushed to remove loose hair and distribute natural oils. Occasional bathing is sufficient to keep them clean and fresh.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Grooming Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: "German Shepherds have ears prone to infections, so it's important to check their ears regularly and to clean them when required with a cotton ball and a mild ear-cleaning solution.",
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Ear Cleaner',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'doberman',
    gridLabel: 'Doberman',
    slug: 'doberman',
    name: 'Doberman',
    img: 'https://images.unsplash.com/photo-1649571068605-844f3be0faa1?auto=format&fit=crop&q=80&w=774',
    hero: require('../../assets/images/german.png'),
    short:
      'The Doberman Pinscher is alert, fearless, and intelligent — known for their loyalty and athleticism. With proper training and socialization, Dobermans are gentle, loving family dogs and reliable protectors.',
    facts: {
      life: '10-13 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Alert, Loyal, Fearless',
    },
    colors: ['Black & Tan', 'Black', 'White'],
    weight: { male: '30-45kgs', female: '25-35kgs' },
    height: { male: '61-66cm', female: '56-61cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: require('../../assets/images/german2.png'),
      description:
        'Dobermans tolerate heat well due to their short coat but may need protection in colder climates. Consider a sweater during winter walks.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '30°C',
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
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image: require('../../assets/images/germandiet.png'),
      descBlocks: [
        { text: 'Dobermans', style: 'italicBlue' },
        { text: ' need a ', style: '' },
        { text: 'high-protein, muscle-supportive diet', style: 'bold' },
        { text: ' rich in ', style: '' },
        { text: 'healthy fats and minerals', style: 'bold' },
        { text: ' to maintain strength and agility.', style: 'bold' },
      ],
      tips: [
        {
          step: 1,
          title: 'Prioritize lean proteins',
          desc: 'Choose diets with 25–30% protein to sustain muscle mass and stamina. Chicken, lamb, and fish-based foods are excellent.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'High-Protein Kibble',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Support heart & joints',
          desc: 'Include foods with taurine, Omega-3s, and antioxidants to promote cardiovascular health and strong joints.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Heart Health Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Avoid fillers & excess carbs',
          desc: 'Avoid foods with wheat, corn, and soy to reduce digestive stress and maintain lean muscle.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Grain-Free Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Tailor diet to activity level',
          desc: 'Adjust portion sizes for active or working Dobermans versus indoor pets to prevent under or overfeeding.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Active Dog Food',
          orientation: 'left',
        },
      ],
      homecooked: {
        title: 'Home‑cooked food must contain:',
        leftNote:
          'Preparing home‑cooked meals may be time consuming and nutritionally incomplete, consider adding food toppers or supplements to make up for the lack of nutrients.',
        wheelCenterImage: require('../../assets/images/wheelgerman.png'),
      },
    },

    training: {
      title: 'TRAINING',
      icon: require('../../assets/icons/paw2.png'),
      image: require('../../assets/images/germantraining.png'),
      descBlocks: [
        { text: 'Dobermans', style: 'italicBlue' },
        { text: ' are fast learners and highly intelligent. ', style: '' },
        {
          text: 'Consistent structure, early socialization, and mental exercise',
          style: 'bold',
        },
        {
          text: ' make them obedient and confident companions.',
          style: 'bold',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Confidence building',
          desc: 'Expose your Doberman to various people and settings early to build confidence and reduce overprotectiveness.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Training Harness',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Mental & physical exercise',
          desc: 'Provide at least 1–2 hours of activity daily—agility drills, obedience games, or jogs to keep them engaged.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Agility Cone Set',
          orientation: 'left',
        },
      ],
    },
    grooming: {
      title: 'GROOMING',
      icon: require('../../assets/icons/paw2.png'),
      // image: require('../../assets/images/doberman-grooming.png'),
      descBlocks: [
        { text: 'Dobermans', style: 'italicBlue' },
        { text: ' have a ', style: '' },
        { text: 'sleek, short coat', style: 'bold' },
        {
          text: ' that sheds minimally. Routine grooming keeps them looking sharp and healthy.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Weekly brushing',
          desc: 'Use a soft brush weekly to remove loose hair and enhance shine.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Soft Bristle Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Skin & nail care',
          desc: 'Wipe down with a damp cloth between baths, trim nails regularly, and check ears weekly for cleanliness.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Nail Clipper Set',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'golden-retriever',
    gridLabel: 'Golden Retriever',
    slug: 'golden-retriever',
    name: 'Golden Retriever',
    img: 'https://images.unsplash.com/photo-1649571068605-844f3be0faa1?auto=format&fit=crop&q=80&w=774',
    hero: require('../../assets/images/german.png'), // local
    short:
      'The Golden Retriever is gentle, affectionate, and eager to please. Famous for their friendly nature and trainability, Golden Retrievers are wonderful family companions and excel in therapy, service, and outdoor activities.',
    category: 'dogs',
    facts: {
      life: '10-12 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Confident, Courageous, Smart',
    },
    colors: ['Black & Tan', 'Black', 'White'],
    weight: { male: '25-34kgs', female: '20-30kgs' },
    height: { male: '61-66cm', female: '56-61cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: require('../../assets/images/german2.png'),
      description:
        'Golden Retrievers adapt to most climates but prefer moderate weather. Protect from extreme heat and dry thoroughly after swimming to avoid skin issues.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '30°C',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '4°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image: require('../../assets/images/germantraits.png'), // traits dog cutout, circle bg
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      // image: require('../../assets/images/goldendiet.png'),
      descBlocks: [
        { text: 'Golden Retrievers', style: 'italicBlue' },
        {
          text: ' thrive on a ',
          style: '',
        },
        { text: 'high-quality, balanced diet', style: 'bold' },
        {
          text: ' that supports joint health, energy, and coat condition.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Include lean protein',
          desc: 'Golden Retrievers require 18–25% protein for strong muscles and energy. Chicken, fish, and lamb-based diets are great options.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Support joint health',
          desc: 'Add glucosamine, chondroitin, and Omega-3 fatty acids to reduce inflammation and promote joint flexibility.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Avoid excess treats',
          desc: 'Goldens have a tendency to gain weight easily. Use portion-controlled meals and low-calorie snacks.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Age-appropriate meals',
          desc: 'Choose puppy, adult, or senior formulas according to age and activity levels.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Puppy Starter Food',
          orientation: 'left',
        },
      ],
      homecooked: {
        title: 'Home‑cooked food must contain:',
        leftNote:
          'Preparing home‑cooked meals may be time consuming and nutritionally incomplete, consider adding food toppers or supplements to make up for the lack of nutrients.',
        // wheelCenterImage: require('../../assets/images/wheelgerman.png'),
      },
    },
    training: {
      title: 'TRAINING',
      icon: require('../../assets/icons/paw2.png'),
      // image: require('../../assets/images/goldentraining.png'),
      descBlocks: [
        { text: 'Golden Retrievers', style: 'italicBlue' },
        { text: ' are intelligent, loyal, and eager to please. ', style: '' },
        {
          text: 'Positive reinforcement, daily exercise, and mental enrichment',
          style: 'bold',
        },
        { text: ' make training effective and fun.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Regular exercise',
          desc: 'Provide at least 60 minutes of physical activity daily—fetch, swimming, and walking are excellent choices.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Mental stimulation',
          desc: 'Incorporate scent games, puzzles, and basic commands to keep them sharp and well-behaved.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Puzzle Feeder',
          orientation: 'left',
        },
      ],
    },
    grooming: {
      title: 'GROOMING',
      icon: require('../../assets/icons/paw2.png'),
      // image: require('../../assets/images/groominggolden.png'),
      descBlocks: [
        { text: 'Golden Retrievers', style: 'italicBlue' },
        { text: ' have a dense, water-repellent coat.', style: '' },
        {
          text: ' Regular brushing minimizes shedding and keeps their coat clean and shiny.',
          style: 'bold',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Frequent brushing',
          desc: 'Brush 3–4 times a week using a slicker or de-shedding brush, especially during shedding seasons.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Bath & ear care',
          desc: 'Bathe every 4–6 weeks using gentle shampoo and clean ears weekly to prevent infections.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
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
      {/* <View style={styles.dogChipRow}>
        <View style={styles.dogChip}>
          <Text style={styles.dogIcon}>🐶</Text>
          <Text style={styles.dogChipText}>DOGS</Text>
        </View>
      </View> */}
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
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
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
