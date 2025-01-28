import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCoins } from './CoinContext';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';

export default function MainMenuScreen() {
  const navigation = useNavigation();

  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [dailyFactVisible, setDailyFactVisible] = useState(false);

  const { coins } = useCoins();


  const dailyFacts = [
    'Bulls and Colors: Despite popular belief, bulls aren’t enraged by the color red. They are colorblind to red and react instead to the movement of the cape in bullfighting.',
    'A Symbol of Strength: In many cultures, the bull is a universal symbol of power, fertility, and strength, often represented in mythology and art.',
    'The Oldest Bull Statue: The oldest known bull statue, dating back over 9,000 years, was found in Çatalhöyük, an ancient settlement in Turkey.',
    'Massive Horns: The Ankole-Watusi bull holds the record for the largest horns, with some measuring over 8 feet from tip to tip.',
    'Bulls in Space: A celestial constellation named Taurus depicts a bull, inspired by the Greek myth of Zeus transforming into a bull.',
    'Water Buffalo Legacy: Water buffaloes, often called “bulls” in Asia, have been domesticated for over 5,000 years and play a vital role in agriculture.',
    'The Spanish Fighting Bull: Spanish fighting bulls are specially bred for their aggression and agility, making them the centerpiece of traditional bullfights.',
    'Bulls and Yoga: In Hinduism, Nandi the bull is the sacred vehicle of Lord Shiva and is often depicted sitting in meditation outside temples.',
    'A Bull\'s Diet: Bulls are herbivores and can eat up to 40 pounds of grass, hay, and other vegetation every day to sustain their massive size.',
    'Bull Run Festivals: Spain\'s famous Running of the Bulls in Pamplona dates back to the 14th century and draws thrill-seekers from all over the world.',
    'Guinness World Record Bull: A Charolais bull named “Trigger” from England holds the record for the heaviest bull, weighing an astonishing 3,836 pounds.',
    'Bulls and Rodeos: In rodeos, bulls are specifically trained for bucking, and their unpredictable behavior makes bull riding one of the most dangerous sports.'
  ];


  const getDailyFactIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % dailyFacts.length;
  };


  const dailyFactText = dailyFacts[getDailyFactIndex()];

  const closeWelcome = () => {
    setWelcomeVisible(false);
  };

  const openDailyFact = () => {
    setDailyFactVisible(true);
  };

  const closeDailyFact = () => {
    setDailyFactVisible(false);
  };

  return (
    <ImageBackground source={require('../assets/backimg.jpg')} style={styles.background}>
     
      <Modal visible={welcomeVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, styles.centerText]}>Welcome to BullQuest!</Text>
            <Text style={[styles.modalText, styles.centerText]}>
              Dive into the world of bulls! Explore fascinating information about different breeds, test your knowledge in themed quizzes, and enjoy a fun mini-game. Earn points as you play and spend them on unique bull-themed wallpapers for your phone. Let the adventure begin!
            </Text>
            <TouchableOpacity style={styles.customButton} onPress={closeWelcome}>
              <Text style={styles.customButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>      
      <Modal visible={dailyFactVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Daily Fact</Text>
            <Text style={styles.modalText}>{dailyFactText}</Text>
            <TouchableOpacity style={styles.customButton} onPress={closeDailyFact}>
              <Text style={styles.customButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.topRow}>
        
        <View style={styles.coinsContainer}>
          <Image
            source={require('../assets/coin.png')}
            style={styles.coinImage}
          />
          <Text style={styles.coinsText}>Points: {coins}</Text>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>

      
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <TouchableOpacity
          style={styles.verticalButton}
          onPress={() => navigation.navigate('WallpapersScreen')}
        >
          <Text style={styles.verticalButtonText}>Bull Wallpapers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.verticalButton}
          onPress={() => navigation.navigate('BullEncyclopedia')}
        >
          <Text style={styles.verticalButtonText}>Bull Encyclopedia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('GamesScreen')}
        >
          <Text style={styles.menuButtonText}>Games</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Photobook')}
        >
          <Text style={styles.menuButtonText}>Photobook</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={openDailyFact}
        >
          <Text style={styles.menuButtonText}>Daily Fact</Text>
        </TouchableOpacity>

        
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.menuButtonText}>Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  coinImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  topRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 214, 191, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#C4A484',
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B4B3F',
  },
  settingsButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(231, 214, 191, 0.8)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#C4A484',
  },
  settingsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B4B3F',
  },
  menuContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  verticalButton: {
    backgroundColor: '#7C6656',
    marginVertical: 10,
    paddingVertical: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B29985',
  },
  verticalButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#F6E8D6',
  },
  menuButton: {
    backgroundColor: 'rgba(196, 153, 133, 0.8)',
    marginVertical: 8,
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5E3C',
  },
  menuButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FAF3EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'rgba(245, 234, 216, 0.9)',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#704F37',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#5B4B3F',
  },
  centerText: {
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: '#7C6656',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  customButtonText: {
    color: '#F6E8D6',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});