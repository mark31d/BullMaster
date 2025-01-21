import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAudio } from './AudioContext'; // Используем контекст для музыки
import { useVibration } from './VibrationContext'; // Используем контекст для вибрации
import { useCoins } from './CoinContext';
const { width, height } = Dimensions.get('window');

const Settings = ({ navigation }) => {
  const { isMusicPlaying, setIsMusicPlaying, volume, setVolume } = useAudio();
  const { vibrationOn, setVibrationOn} = useVibration();
  const [localVolume, setLocalVolume] = useState(volume);
  const { resetScores } = useCoins(); 
  const handleVolumeChange = (change) => {
    const newVolume = Math.max(0, Math.min(1, localVolume + change));
    setLocalVolume(newVolume);
    setVolume(newVolume); // Обновляем глобальный объем в контексте
  };

  const resetScoreboard = () => {
    Alert.alert(
      'Reset Scores',
      'Are you sure you want to reset all scores?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            console.log('Scores reset');
            await resetScores();  // сброс глобальных значений и сохранение в AsyncStorage
          } 
        },
      ]
    );
  };

  useEffect(() => {
    setVolume(localVolume);
  }, [localVolume, setVolume]);

  return (
    <ImageBackground source={require('../assets/backimg.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.setting}>
            <Text style={styles.settingText}>Turn Music On/Off</Text>
            <Switch
              value={isMusicPlaying}
              onValueChange={setIsMusicPlaying}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={isMusicPlaying ? '#1B5E20' : '#4E342E'}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingText}>Music Volume: {Math.round(localVolume * 100)}%</Text>
            <View style={styles.volumeControls}>
              <TouchableOpacity onPress={() => handleVolumeChange(-0.1)} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleVolumeChange(0.1)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingText}>Enable Vibration</Text>
            <Switch
              value={vibrationOn}
              onValueChange={setVibrationOn}
              trackColor={{ false: '#767577', true: '#FFC107' }}
              thumbColor={vibrationOn ? '#FF6F00' : '#4E342E'}
            />
          </View>

          <TouchableOpacity onPress={resetScoreboard} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset All Scores</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigation.goBack} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Return to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#D4A373', // Яркий золотистый цвет
    textAlign: 'center',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.02,
    padding: height * 0.02,
    borderRadius: 15,
    backgroundColor: '#D4A373', // Светло-золотистый
    borderColor: '#333',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  settingText: {
    fontSize: width * 0.05,
    color: '#FFFFFF', // Белый цвет текста
    flex: 1,
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: width * 0.12,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E342E', // Темно-коричневый для кнопок
    borderRadius: 10,
    marginHorizontal: width * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: width * 0.06,
    color: '#FFFFFF', // Белый цвет текста
  },
  resetButton: {
    marginTop: height * 0.03,
    backgroundColor: '#D32F2F', // Красный для сброса очков
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButtonText: {
    fontWeight: 'bold',
    fontSize: width * 0.05,
    color: '#FFFFFF', // Белый текст
  },
  exitButton: {
    marginTop: height * 0.03,
    backgroundColor: '#D4A373', // Зеленый для кнопки возврата
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  exitButtonText: {
    fontWeight: 'bold',
    fontSize: width * 0.05,
    color: '#FFFFFF', // Белый текст
  },
});

export default Settings;