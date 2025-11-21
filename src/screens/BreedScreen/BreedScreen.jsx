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
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608619/2_xoutja.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608619/2_xoutja.png',
    short:
      'The Doberman is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Dobermans excel in family environments, working roles, and active lifestyles.',

    facts: {
      life: '10-13 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Sleek, Short coat',
    },
    colors: ['Black & Tan', 'Black', 'White'],
    weight: { male: '30-45 kg', female: '30-40 kg' },
    height: { male: '68-72 cm', female: '63-68 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608619/1_sdegkv.png',
      description:
        'Dobermans adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608619/3_bmeoff.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      subtitle: 'Consider following tips when choosing food for your Doberman.',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608618/4_earnzn.png',
      descBlocks: [
        { text: 'Dobermans', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet', style: 'bold' },
        { text: ' rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Dobermans thrive on 25–30% protein with healthy fats to maintain strength and agility for their athletic lifestyle.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'High-Protein Kibble',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Dobermans should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Heart Health Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Grain-Free Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: 'Choose an appropriate diet according to your Doberman age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608618/6_ka1aym.png',
      descBlocks: [
        { text: 'Dobermans', style: 'italicBlue' },
        { text: ' require ', style: '' },
        { text: 'regular exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Training Harness',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608623/7_uxsepu.png',
      descBlocks: [
        { text: 'Dobermans', style: 'italicBlue' },
        { text: ' have relatively ', style: '' },
        { text: 'low grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine.', style: 'bold' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and Bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Soft Bristle Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
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
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613210/1_chrnnl.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613210/1_chrnnl.png',
    short:
      'The Golden Retriever is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Golden Retrievers excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '10-12 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Double coat, medium length, water-repellent"',
    },
    colors: ['Light Golden', 'Golden', 'Dark Golden', 'Cream'],
    weight: { male: '30-34 kg', female: '25-32 kg' },
    height: { male: '56-61 cm', female: '51-56 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613210/2_rsuvpp.png',
      description:
        'Golden Retrievers adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613209/3_xqorlz.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613209/4_dxn8kl.png',
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
          title: 'Choose a protein-rich diet',
          desc: 'Golden Retrievers are energetic; look for 18–25% protein for adults and higher for puppies to sustain activity and muscle health.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Golden Retrievers should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: 'Choose an appropriate diet according to your Golden Retriever age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613208/5_kq445j.png',
      descBlocks: [
        { text: 'Golden Retrievers', style: 'italicBlue' },
        { text: ' require ', style: '' },
        { text: 'regular exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613208/6_yclflk.png',
      descBlocks: [
        { text: 'Golden Retrievers', style: 'italicBlue' },
        { text: ' have relatively ', style: '' },
        { text: 'low grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine.', style: 'bold' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'boxer',
    gridLabel: 'Boxer',
    slug: 'boxer',
    name: 'Boxer',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608329/1_li3y1f.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608329/1_li3y1f.png',
    short:
      'The Boxer is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Boxers excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '10-12 years',
      size: 'Medium to Large',
      shedding: 'High',
      coat: 'Short, smooth coat',
    },
    colors: ['Fawn', 'Brindle', 'White'],
    weight: { male: '30-35 kg', female: '25-32 kg' },
    height: { male: '57-63 cm', female: '53-60 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608328/2_ahmoml.png',
      description:
        'Boxers adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
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
        value: '6°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608329/3_rmxk7n.png', // traits dog cutout, circle bg
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608331/4_ttexps.png',
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608331/4_ttexps.png',
      descBlocks: [
        { text: 'Boxers', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet', style: 'bold' },
        { text: ' rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          title: 'Choose a protein-rich diet',
          desc: 'Boxers benefit from 22–28% protein, heart-supportive nutrients (taurine, Omega-3s) and joint support to match their activity.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Boxers should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: 'Choose an appropriate diet according to your Golden Retriever age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608328/6_ke1zlc.png',
      descBlocks: [
        { text: 'Boxers', style: 'italicBlue' },
        { text: ' require ', style: '' },
        { text: 'regular exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Puzzle Feeder',
          orientation: 'left',
        },
      ],
    },
    grooming: {
      title: 'GROOMING',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762608329/7_jd7cv8.png',
      descBlocks: [
        { text: 'Boxers', style: 'italicBlue' },
        { text: ' have relatively ', style: '' },
        { text: 'low grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine.', style: 'bold' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          foodImage: require('../../assets/images/dummyfood.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'pomeranian',
    gridLabel: 'Pomeranian',
    slug: 'pomeranian',
    name: 'Pomeranian',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612125/1_mizvdl.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612125/1_mizvdl.png',
    short:
      'The Pomeranian is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Pomeranians excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '12-16 years',
      size: 'Small',
      shedding: 'High',
      coat: 'Thick, fluffy double coat',
    },
    colors: ['Orange', 'Cream', 'Black', 'Sable'],
    weight: { male: '3-4 kg', female: '2-3.5 kg' },
    height: { male: '21-28 cm', female: '18-25 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612124/2_obeumi.png',
      description:
        'Pomeranians adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
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
        value: '6°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612124/3_ck7iow.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612124/4_th3epe.png',
      descBlocks: [
        { text: 'Pomeranians', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet', style: 'bold' },
        { text: ' rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],

      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Pomeranians thrive on nutrient-dense small-breed diets with Omega-rich ingredients to support their coat and energy levels.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Pomeranians should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: 'Choose an appropriate diet according to your Golden Retriever age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612124/6_pkouhr.png',
      descBlocks: [
        { text: 'Pomeranians', style: 'italicBlue' },
        { text: ' require ', style: '' },
        { text: 'regular exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612124/7_o5yr6i.png',
      descBlocks: [
        { text: 'Pomeranians', style: 'italicBlue' },
        { text: ' have relatively ', style: '' },
        { text: 'low grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine.', style: 'bold' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'pug',
    gridLabel: 'Pug',
    slug: 'pug',
    name: 'Pug',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612260/1_smqhpr.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612260/1_smqhpr.png',
    short:
      'The Pug is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Pugs excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '12-15 years',
      size: 'Small',
      shedding: 'High',
      coat: 'Short, smooth coat with facial folds',
    },
    colors: ['Orange', 'Cream', 'Black', 'Sable'],
    weight: { male: '6-8 kg', female: '6-8 kg' },
    height: { male: '30-36 cm', female: '28-34 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612260/2_f2gkdj.png',
      description:
        'Pomeranians adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
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
        value: '6°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612259/3_ikpxht.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612259/4_n6f3o4.png',
      descBlocks: [
        { text: 'Pomeranians', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet', style: 'bold' },
        { text: ' rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],

      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Pomeranians thrive on nutrient-dense small-breed diets with Omega-rich ingredients to support their coat and energy levels.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Pomeranians should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: 'Choose an appropriate diet according to your Golden Retriever age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612260/6_arla5n.png',
      descBlocks: [
        { text: 'Pomeranians', style: 'italicBlue' },
        { text: ' require ', style: '' },
        { text: 'regular exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612258/7_s0om8l.png',
      descBlocks: [
        { text: 'Pomeranians', style: 'italicBlue' },
        { text: ' have relatively ', style: '' },
        { text: 'low grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine.', style: 'bold' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'rottweiler',
    gridLabel: 'Rottweiler',
    slug: 'rottweiler',
    name: 'Rottweiler',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612610/1_jifxgq.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612610/1_jifxgq.png',
    short:
      'The Rottweiler is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Rottweilers excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '9-10 years',
      size: 'Large',
      shedding: 'High',
      coat: 'Short, dense double coat',
    },
    colors: ['Black & Tan'],
    weight: { male: '45-60 kg', female: '35-48kg' },
    height: { male: '61-69 cm', female: '56-63 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612611/2_e2yamf.png',
      description:
        'Pomeranians adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '"28°C",',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '0°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612610/3_vaxacr.png',
      title: 'TRAITS',
      desc: 'Rottweilers thrive on a high-protein, balanced diet rich in animal-based proteins, healthy fats, and essential vitamins to support their active lifestyle and joint health.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612610/4_slizal.png',
      descBlocks: [
        { text: 'Rottweilers', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet rich in ', style: 'normal' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: 'normal' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: 'normal' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: 'normal' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: 'normal' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Rottweilers benefit from lean, protein-rich diets (22–28%) with joint-supporting nutrients for their large, muscular build.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Rottweilers should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your Rottweiler's age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612609/6_s8wks9.png',
      descBlocks: [
        { text: 'Rottweilers', style: 'italicBlue' },
        { text: ' require regular ', style: '' },
        { text: 'exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612609/7_mns7id.png',
      descBlocks: [
        { text: 'Rottweilers', style: 'italicBlue' },
        { text: ' have relatively low ', style: '' },
        { text: 'grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'beagle',
    gridLabel: 'Beagle',
    slug: 'beagle',
    name: 'Beagle',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612759/1_jaix4f.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612759/1_jaix4f.png',
    short:
      'The Beagle is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Beagles excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '12-15 years',
      size: 'Small to Medium',
      shedding: 'High',
      coat: 'Short, Dense coat',
    },
    colors: ['Black & Tan'],
    weight: { male: '10-14 kg', female: '9-13 kg' },
    height: { male: '36-41 cm', female: '33-38 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612758/2_dqkgls.png',
      description:
        'Beagles adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '"30°C",',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '5°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612758/3_xsld2a.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612759/4_mimtes.png',
      descBlocks: [
        { text: 'Beagles', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Beagles are prone to overeating—use measured portions with 18–25% protein and moderate calories to maintain ideal weight.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Beagles should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your Rottweiler's age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612757/6_sgshvg.png',
      descBlocks: [
        { text: 'Beagles', style: 'italicBlue' },
        { text: ' require regular ', style: '' },
        { text: 'exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762612759/7_llhizn.png',
      descBlocks: [
        { text: 'Beagles', style: 'italicBlue' },
        { text: ' have relatively low ', style: '' },
        { text: 'grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'great-dane',
    gridLabel: 'Great Dane',
    slug: 'great-dane',
    name: 'Great Dane',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613293/2_a9edol.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613293/2_a9edol.png',
    short:
      'The Great Dane is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Great Danes excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '8-10 years',
      size: 'Giant',
      shedding: 'High',
      coat: 'Short, Smooth coat',
    },
    colors: ['Fawn', 'Brindle', 'Harlequin', 'Blue', 'Black'],
    weight: { male: '63-80 kg', female: '50-66 kg' },
    height: { male: '76-86  cm', female: '71-81 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613296/1_syzop5.png',
      description:
        'Great Danes adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '"28°C",',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '5°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613292/3_s1apwo.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613291/4_kdhvdy.png',
      descBlocks: [
        { text: 'Great Danes', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Great Danes require controlled large-breed nutrition with balanced calcium and multiple small meals to help prevent bloating.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Great Danes should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your Great Dane's age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613292/6_nc8twn.png',
      descBlocks: [
        { text: 'Great Danes', style: 'italicBlue' },
        { text: ' require regular ', style: '' },
        { text: 'exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762613290/7_opf4ej.png',
      descBlocks: [
        { text: 'Great Danes', style: 'italicBlue' },
        { text: ' have relatively low ', style: '' },
        { text: 'grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'labrador-retriever',
    gridLabel: 'Labrador Retriever',
    slug: 'labrador-retriever',
    name: 'Labrador Retriever',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615185/2_s7s5gd.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615185/2_s7s5gd.png',
    short:
      'The Labrador Retriever is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Labrador Retrievers excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '10-14 years',
      size: 'Medium to Large',
      shedding: 'High',
      coat: 'Short, dense double coat, water-resistant',
    },
    colors: ['Black', 'Yellow', 'Chocolate'],
    weight: { male: '29-36 kg', female: '25-32 kg' },
    height: { male: '57-62  cm', female: '55-60 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615185/1_vtfzpb.png',
      description:
        'Labrador Retrievers adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '"30°C",',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '5°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615184/3_pcm7uj.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615184/4_t1xr83.png',
      descBlocks: [
        { text: 'Labrador Retrievers', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Labrador Retrievers love food; choose portion-controlled meals with 18–25% protein to maintain energy and prevent excess weight.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Labrador Retrievers should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your Great Dane's age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615183/6_wvkwvg.png',
      descBlocks: [
        { text: 'Labrador Retrievers', style: 'italicBlue' },
        { text: ' require regular ', style: '' },
        { text: 'exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615183/7_ntbpsv.png',
      descBlocks: [
        { text: 'Labrador Retrievers', style: 'italicBlue' },
        { text: ' have relatively low ', style: '' },
        { text: 'grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'shih-tzu',
    gridLabel: 'Shih Tzu',
    slug: 'shih-tzu',
    name: 'Shih Tzu',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615278/2_fcwnjg.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615278/2_fcwnjg.png',
    short:
      'The Shih Tzu is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Labrador Retrievers excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '10-16 years',
      size: 'Small',
      shedding: 'High',
      coat: 'Long, flowing double coat',
    },
    colors: ['Gold & White', 'Black & White', 'Solid Black', 'Solid Gold'],
    weight: { male: '5-7.5 kg', female: '4-6.5 kg' },
    height: { male: '23-27  cm', female: '20-24 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615281/1_miqxlm.png',
      description:
        'Shih Tzus adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
      hot: {
        icon: require('../../assets/icons/hot.png'),
        label: 'Hot weather tolerance:',
        valuePrefix: 'up to ',
        value: '"32°C",',
        gradient: ['#FFC773', '#F3A64B'],
      },
      cold: {
        icon: require('../../assets/icons/cold.png'),
        label: 'Cold weather tolerance:',
        valuePrefix: 'up to ',
        value: '10°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615275/3_upzagz.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615275/4_q32mip.png',
      descBlocks: [
        { text: 'Shih Tzus', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Shih Tzus do best with small-bite kibble (20–25% protein) and Omega-rich foods to support coat health.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Shih Tzus should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your Great Dane's age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615274/6_ob833h.png',
      descBlocks: [
        { text: 'Shih Tzus', style: 'italicBlue' },
        { text: ' require regular ', style: '' },
        { text: 'exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762615275/7_dugtfj.png',
      descBlocks: [
        { text: 'Shih Tzus', style: 'italicBlue' },
        { text: ' have relatively low ', style: '' },
        { text: 'grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Mild Dog Shampoo',
          orientation: 'left',
        },
      ],
    },
  },
  {
    key: 'siberian-husky',
    gridLabel: 'Siberian Husky',
    slug: 'siberian-husky',
    name: 'Siberian Husky',
    img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459345/2_iotewa.png',
    hero: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459345/2_iotewa.png',
    short:
      'The Siberian Husky is known for its signature traits—loyalty, intelligence, and trainability. Recognized for their confidence and affectionate nature, Labrador Retrievers excel in family environments, working roles, and active lifestyles.',
    category: 'dogs',
    facts: {
      life: '12-15 years',
      size: 'Medium to Large',
      shedding: 'High',
      coat: 'Thick double coat',
    },
    colors: ['Black & White', 'Gray & White', 'Red & White', 'Agouti'],
    weight: { male: '20-27 kg', female: '16-23 kg' },
    height: { male: '54-60  cm', female: '50-56 cm' },
    adaptability: {
      title: 'ADAPTABILITY',
      leadingEmoji: require('../../assets/icons/paw2.png'),
      img: 'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459348/1_s4cmub.png',
      description:
        'Siberian Huskies adapt well to both hot and cold climates, thanks to their coat and overall resilience.',
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
        value: '-15°C',
        gradient: ['#6EC1DC', '#4AA3DA'],
      },
    },
    traits: {
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459345/3_sutmqz.png',
      title: 'TRAITS',
      desc: 'These attributes have been rated by dog trainers, expert vets and pet behaviorists. Remember that all dogs are individuals with their own personalities.',
      bottomNote:
        'German Shepherd Need Experienced Handling, Consistent Training And Early Socialization Which Can Pose Challenges For Inexperienced Owners',
    },
    diet: {
      title: 'DIET',
      icon: require('../../assets/icons/paw2.png'),
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459345/4_uhnqqm.png',
      descBlocks: [
        { text: 'Siberian Huskies', style: 'italicBlue' },
        { text: ' thrive on a ', style: '' },
        { text: 'high-protein, balanced diet rich in ', style: '' },
        { text: 'animal-based proteins', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'healthy fats', style: 'bold' },
        { text: ', and essential vitamins to support their ', style: '' },
        { text: 'active lifestyle', style: 'bold' },
        { text: ' and ', style: '' },
        { text: 'joint health', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Choose a protein-rich diet',
          desc: 'Siberian Huskies need 25–30% protein and healthy fats; they self-regulate portions, so serve moderate meals and ensure hydration.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Chicken Formula',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Avoid fillers & additives',
          desc: 'Siberian Huskys should avoid foods with heavy fillers such as wheat and soy that may be difficult to digest or trigger sensitivities.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Joint Care Supplement',
          orientation: 'left',
        },
        {
          step: 3,
          title: 'Add Essential Fatty Acids"',
          desc: 'Look for foods containing Omega-3 and Omega-6 fatty acids to support skin, coat, and joint comfort.',
          boxColor: '#DFF1FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Weight Control Food',
          orientation: 'right',
        },
        {
          step: 4,
          title: 'Consider their age',
          desc: "Choose an appropriate diet according to your Great Dane's age—puppies need more protein and fat for growth, while adult and senior dogs may require lower levels for weight maintenance.",
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459345/6_xsdwue.png',
      descBlocks: [
        { text: 'Siberian Huskies', style: 'italicBlue' },
        { text: ' require regular ', style: '' },
        { text: 'exercise', style: 'bold' },
        { text: ', proper ', style: '' },
        { text: 'grooming', style: 'bold' },
        { text: ', ', style: '' },
        { text: 'socialization', style: 'bold' },
        { text: ', and consistent ', style: '' },
        { text: 'training', style: 'bold' },
        {
          text: ' to maintain their physical health and mental well-being.',
          style: '',
        },
      ],
      tips: [
        {
          step: 1,
          title: 'Physical training and exercises',
          desc: 'Include activities such as running, playing fetch, swimming, agility training, or hiking in their routine.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-4.png'),
          foodLabel: 'Floating Fetch Toy',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Interactive play',
          desc: 'Use scent-retention games and puzzle toys to provide mental stimulation and keep them engaged.',
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
      image:
        'https://res.cloudinary.com/dtypwgdpn/image/upload/v1762459345/7_rjntcg.png',
      descBlocks: [
        { text: 'Siberian Huskies', style: 'italicBlue' },
        { text: ' have relatively low ', style: '' },
        { text: 'grooming needs', style: 'bold' },
        {
          text: ' despite their coat type. Here are some essential tips to ensure they ',
          style: '',
        },
        { text: 'shine', style: 'bold' },
        { text: '.', style: '' },
      ],
      tips: [
        {
          step: 1,
          title: 'Brush and bath',
          desc: 'Brush regularly to remove loose hair and distribute natural oils. Occasional bathing keeps them clean and fresh.',
          boxColor: '#E4F4FB',
          // foodImage: require('../../assets/images/gold-3.png'),
          foodLabel: 'Slicker Brush',
          orientation: 'right',
        },
        {
          step: 2,
          title: 'Keep their ears clean',
          desc: 'Check ears regularly and clean when required with a cotton ball and a mild ear-cleaning solution.',
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
