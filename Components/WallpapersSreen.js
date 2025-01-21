import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Modal,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCoins } from './CoinContext'; // Ваш контекст для работы с монетами
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

// Пример массива обоев
const wallpapers = [
  { id: 1, image: require('../assets/bull1.jpg'), price: 100, owned: false },
  { id: 2, image: require('../assets/bull2.jpg'), price: 200, owned: false },
  { id: 3, image: require('../assets/bull3.jpg'), price: 150, owned: false },
  { id: 4, image: require('../assets/bull4.jpg'), price: 250, owned: false },
  { id: 5, image: require('../assets/bull5.jpg'), price: 300, owned: false },
  { id: 6, image: require('../assets/bull6.jpg'), price: 120, owned: false },
  { id: 7, image: require('../assets/bull7.jpg'), price: 180, owned: false },
  { id: 8, image: require('../assets/bull8.jpg'), price: 220, owned: false },
  { id: 9, image: require('../assets/bull9.jpg'), price: 170, owned: false },
  { id: 10, image: require('../assets/bull10.jpg'), price: 200, owned: false },
];

const WallpapersScreen = () => {
  const navigation = useNavigation();
  const { coins, setCoins } = useCoins();
  const [wallpapersState, setWallpapersState] = useState(wallpapers);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);

  // Загрузить из AsyncStorage (сведения о купленных обоях)
  useEffect(() => {
    const loadWallpapers = async () => {
      try {
        const savedWallpapers = await AsyncStorage.getItem('wallpapers');
        if (savedWallpapers) {
          setWallpapersState(JSON.parse(savedWallpapers));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadWallpapers();
  }, []);

  // Сохранить в AsyncStorage
  const saveWallpapers = async (updatedWallpapers) => {
    try {
      await AsyncStorage.setItem(
        'wallpapers',
        JSON.stringify(updatedWallpapers)
      );
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Покупка обоев
  const handleBuy = (id, price) => {
    if (userCoins >= price) {
      const updated = wallpapersState.map((wp) =>
        wp.id === id ? { ...wp, owned: true } : wp
      );
      setWallpapersState(updated);
      setUserCoins(userCoins - price);
      saveWallpapers(updated);
    } else {
      Alert.alert('Not enough coins!', 'You do not have enough coins to buy this wallpaper.');
    }
  };// Запросить разрешение на доступ к фото (только iOS)
  const requestPermission = async () => {
    try {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) {
        return true;
      }
      if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
        const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return requestResult === RESULTS.GRANTED;
      }
      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission blocked',
          'Storage access is blocked. Please enable it in device settings.'
        );
        return false;
      }
      Alert.alert('Permission not granted', 'The app did not receive permission to save the image.');
      return false;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'An error occurred while requesting permissions.');
      return false;
    }
  };

  // Сохранить выбранные обои в Documents (iOS) + проверить, что файл появился
  const handleDownload = async () => {
    if (!selectedWallpaper) {
      Alert.alert('No wallpaper selected', 'Please select a wallpaper to save.');
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return;
    }

    try {
      // Получаем URI для картинки из бандла
      const assetSource = Image.resolveAssetSource(selectedWallpaper);
      if (!assetSource || !assetSource.uri) {
        console.error('Image URI not found:', selectedWallpaper);
        Alert.alert('Error', 'Failed to get the image URI.');
        return;
      }

      // Генерируем имя файла
      const fileName = `wallpaper_${Date.now()}.jpg`;
      // Путь для iOS (Documents)
      const savePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Копируем из ресурсов приложения в нужное место
      await RNFS.copyFile(assetSource.uri, savePath);

      // [Новый код] Просмотреть список файлов в Documents, чтобы убедиться, что файл появился
      const filesInDoc = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      console.log('Files in Documents:', filesInDoc);

      Alert.alert('Success', `Wallpaper saved to:\n${savePath}`);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'An error occurred while saving the image.');
    }
  };

  // Рендер одного элемента (одни обои)
  const renderWallpaper = ({ item }) => (
    <View style={styles.wallpaperContainer}>
      <TouchableOpacity onPress={() => setSelectedWallpaper(item.image)}>
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            style={[
              styles.wallpaper,
              !item.owned && styles.transparentImage,
              selectedWallpaper === item.image && styles.selectedWallpaper,
            ]}
            resizeMode="contain"
          />
          {/* Иконка замка, если обои не куплены */}
          {!item.owned && (
            <Image
              source={require('../assets/lock.png')}
              style={styles.lockIcon}
            />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        {/* Если обои куплены — пишем Purchased, если нет — кнопка Buy */}
        {item.owned ? (
          <Text style={styles.ownedText}>Purchased</Text>
        ) : (
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handleBuy(item.id, item.price)}
          >
            <Text style={styles.buyButtonText}>Buy ({item.price} coins)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/backimg.jpg')}
        style={styles.backgroundImage}
      >
        {/* Кнопка "Back" + баланс монет */}
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../assets/back_button.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <View style={styles.coinContainer}>
            <Image
              source={require('../assets/coin.png')}
              style={styles.coinIcon}
            />
            <Text style={styles.coinText}>{coins}</Text>
          </View>
        </View>

        {/* Сетка обоев */}
        <FlatList
          data={wallpapersState}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWallpaper}
          numColumns={2}
          contentContainerStyle={styles.listContent}
        />

        {/* Модальное окно полноэкранного просмотра */}
        <Modal visible={!!selectedWallpaper} transparent={true}>
          <View style={styles.modalContainer}>
            {selectedWallpaper && (
              <Image source={selectedWallpaper} style={styles.fullscreenImage} />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedWallpaper(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleDownload}>
                <Text style={styles.closeButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};

export default WallpapersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    opacity: 0.9,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  backButton: {
    zIndex: 2,
  },
  backButtonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  coinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  listContent: {
    padding: 10,
    marginTop: 70, // чтобы не налезало на верхний бар
  },
  wallpaperContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  wallpaper: {
    width: width * 0.4,
    height: height * 0.25,
    borderRadius: 10,
  },
  transparentImage: {
    // имитация ч/б или затемнения (можно использовать любую стилизацию)
    opacity: 0.7,
  },
  selectedWallpaper: {
    // дополнительная стилизация выбранного элемента
    opacity: 0.6,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  lockIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ownedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '70%',
    borderRadius: 20,
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 20,
  },
  closeButton: {backgroundColor: '#FF7043',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});