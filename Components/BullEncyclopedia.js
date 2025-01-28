import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ImageBackground,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'BullCustomImages'; // для кастомних зображень
const USER_ARTICLES_KEY = 'BullUserArticles'; // для записів користувача

const BULL_ARTICLES = [
  {
    id: '1',
    name: 'Brahman Bull',
    habitat:
      'South Asia, especially India and Bangladesh; also common in the United States and Latin America.',
    description:
      'Brahman bulls are one of the most recognizable cattle breeds, known for their distinctive hump over the shoulders, floppy ears, and loose skin. They are hardy animals, highly adaptable to hot and humid climates. Brahman bulls have a calm temperament and are resistant to various diseases and parasites. They are often used as draft animals in agriculture and are valued for their high-quality beef production. Their endurance and adaptability have made them a top choice for crossbreeding worldwide.',
    cultural:
      "In Hindu culture, the Brahman bull is sacred and considered a symbol of divinity. Often associated with Lord Shiva's bull, Nandi, it holds a revered place in temples and rituals. These bulls are rarely slaughtered in India, reflecting their spiritual importance.",
    image: require('../assets/bull101.jpeg'),
  },
  {
    id: '2',
    name: 'Hereford Bull',
    habitat:
      'Originated in England; now found globally, especially in North America, Australia, and Argentina.',
    description:
      'Hereford bulls are medium-sized with a reddish-brown body and white face. Known for their docile nature and efficient grazing ability, they thrive in diverse climates. Hereford cattle are prized for their beef quality, characterized by fine marbling and tenderness. This breed has contributed significantly to modern livestock farming by offering genetic improvements in beef production.',
    cultural:
      'Herefords became symbolic of British agricultural prowess in the 18th century and are often celebrated in farming literature and local fairs. They are also a source of pride in communities that prioritize sustainable farming practices.',
    image: require('../assets/bull102.jpeg'),
  },
  {
    id: '3',
    name: 'Angus Bull',
    habitat:
      'Originated in Scotland; widely raised in North America, Brazil, and Australia.',
    description:
      'Angus bulls are solid black or red and naturally polled (without horns). They are highly valued for their superior meat quality, which is tender, flavorful, and well-marbled. These bulls are known for their hardiness, ease of calving, and rapid weight gain. Their adaptability to harsh weather conditions makes them a preferred breed among farmers.',
    cultural:
      'Angus beef has become a hallmark of premium-quality meat worldwide. In Scotland, Angus cattle are celebrated as part of the nation’s rural heritage and contribute to its global culinary reputation.',
    image: require('../assets/bull103.jpeg'),
  },
  {
    id: '4',
    name: 'Texas Longhorn',
    habitat:
      'Native to Texas, USA; now found in ranches across the Americas.',
    description:
      'Texas Longhorns are famous for their long, curved horns, which can span up to seven feet. They are resilient and adaptable, thriving in arid environments. This breed played a pivotal role in the cattle drives of the 19th century, shaping the cowboy culture of the American West. Known for their lean meat, Longhorns are more valued for their historical and aesthetic appeal today.',
    cultural:
      'The Texas Longhorn is an iconic symbol of the American frontier and cowboy lifestyle, frequently featured in Western films, art, and folklore.',
    image: require('../assets/bull104.jpeg'),
  },
  {
    id: '5',
    name: 'Charolais Bull',
    habitat:'Originated in France; now raised in Europe, North America, and South America.',description:'Charolais bulls are large, muscular cattle with a white or creamy coat. They are renowned for their rapid growth, efficient meat production, and ability to adapt to different climates. This breed has played a crucial role in crossbreeding programs worldwide due to its superior genetics.',cultural:"In France, Charolais cattle are celebrated in rural fairs and festivals, representing the country's rich agricultural history and culinary tradition.",
    image: require('../assets/bull105.jpeg'),
  },
  {
    id: '6',
    name: 'Watusi Bull',
    habitat:
      'Sub-Saharan Africa, particularly in Rwanda, Uganda, and Burundi.',
    description:
      'Watusi bulls are famous for their enormous, symmetrical horns that can span up to eight feet. Known as the "Cattle of Kings," these animals are not primarily raised for meat but as a status symbol in African tribal societies. Their horns help regulate body temperature, making them well-suited for the African savanna.',
    cultural:
      'Watusi cattle are deeply integrated into African traditions, symbolizing wealth, power, and prestige. They are often featured in ceremonies and as dowries in marriage negotiations.',
    image: require('../assets/bull106.jpeg'),
  },
  {
    id: '7',
    name: 'Zebu Bull',
    habitat:
      'South Asia and Africa; also found in South America.',
    description:
      'Zebu bulls are small-to-medium-sized cattle with a prominent hump and large dewlaps. They are well-adapted to tropical climates and are resistant to heat and drought. Zebus are used for plowing, transportation, and milk production, making them a vital part of agricultural life in their native regions.',
    cultural:
      'In South Asia, Zebus are considered sacred animals and are often used in religious festivals and rituals. Their resilience and utility have earned them respect in farming communities.',
    image: require('../assets/bull107.jpeg'),
  },
  {
    id: '8',
    name: 'Simmental Bull',
    habitat:
      'Originated in Switzerland; now raised globally, including in Europe, the Americas, and Africa.',
    description:
      'Simmental bulls are large, dual-purpose cattle valued for both milk and meat production. They have a striking appearance with a red-and-white coat. Known for their docility and versatility, they are one of the oldest and most widely distributed breeds in the world.',
    cultural:
      'Simmentals are a source of pride in Swiss farming culture and are often featured in alpine festivals and parades.',
    image: require('../assets/bull108.jpeg'),
  },
  {
    id: '9',
    name: 'Spanish Fighting Bull',
    habitat:
      'Spain and parts of Latin America.',
    description:
      'Bred for the spectacle of bullfighting, these bulls are muscular, agile, and aggressive. They have a short, glossy coat and distinctively powerful horns. While controversial, the Spanish fighting bull remains a cultural icon, symbolizing strength and bravery.',
    cultural:
      'These bulls are central to Spanish bullfighting traditions, which have been both celebrated and critiqued as a reflection of Spanish identity.',
    image: require('../assets/bull109.jpeg'),
  },
  {
    id: '10',
    name: 'Highland Bull',
    habitat:
      'Scotland; also found in colder climates worldwide.',
    description:
      'Highland bulls are easily recognized by their long, shaggy coats and curved horns. Adapted to harsh environments, they are efficient grazers and provide high-quality, lean meat. Their calm nature and striking appearance make them a favorite for small-scale farmers and tourists alike.',
    cultural:
      'Highland cattle are emblematic of Scotland’s rugged landscape and are often featured in tourism campaigns, literature, and cultural festivals.',
    image: require('../assets/bull110.jpeg'),
  },
];
export default function BullEncyclopedia() {
  const navigation = useNavigation();
  const [selectedArticle, setSelectedArticle] = useState(null);

  // customImages зберігає { [bullId]: 'file://...' } для кожного запису
  const [customImages, setCustomImages] = useState({});
  // Записи, додані користувачем
  const [userArticles, setUserArticles] = useState([]);
  // Відображення модального вікна для додавання нового запису
  const [modalVisible, setModalVisible] = useState(false);
  // Дані форми нового запису
  const [newArticle, setNewArticle] = useState({
    name: '',
    habitat: '',
    description: '',
    cultural: '',
    image: null,
  });

  // Завантаження кастомних зображень з AsyncStorage
  useEffect(() => {
    const loadImages = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCustomImages(JSON.parse(stored));
        }
      } catch (err) {
        console.log('Error loading custom images:', err);
      }
    };
    loadImages();
  }, []);

  // Завантаження записів користувача з AsyncStorage
  useEffect(() => {
    const loadUserArticles = async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_ARTICLES_KEY);
        if (stored) {
          setUserArticles(JSON.parse(stored));
        }
      } catch (err) {
        console.log('Error loading user articles:', err);
      }
    };
    loadUserArticles();
  }, []);// Збереження кастомних зображень в AsyncStorage
  const saveImagesToStorage = async (newCustomImages) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomImages));
    } catch (err) {
      console.log('Error saving custom images:', err);
    }
  };

  // Збереження записів користувача в AsyncStorage
  const saveUserArticlesToStorage = async (articles) => {
    try {
      await AsyncStorage.setItem(USER_ARTICLES_KEY, JSON.stringify(articles));
    } catch (err) {
      console.log('Error saving user articles:', err);
    }
  };

  // Вибір фото з галереї для кастомної картинки обраного запису
  const handlePickPhoto = () => {
    if (!selectedArticle) return;
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', `Error: ${response.errorMessage}`);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const pickedImage = response.assets[0];

        const newCustomImages = {
          ...customImages,
          [selectedArticle.id]: pickedImage.uri,
        };
        setCustomImages(newCustomImages);
        await saveImagesToStorage(newCustomImages);
        // Оновлюємо вибрану статтю, щоб відобразити нове зображення
        setSelectedArticle((prev) =>
          prev
            ? {
                ...prev,
                customUri: pickedImage.uri,
              }
            : prev
        );
      }
    });
  };

  // Відновлення стокового зображення (видалення кастомного для даної статті)
  const handleRestoreDefault = async () => {
    if (!selectedArticle) return;

    const newCustomImages = { ...customImages };
    delete newCustomImages[selectedArticle.id];
    setCustomImages(newCustomImages);
    await saveImagesToStorage(newCustomImages);
    setSelectedArticle((prev) =>
      prev
        ? {
            ...prev,
            customUri: undefined,
          }
        : prev
    );
  };

  // Рендер одного елемента списку (як для статей за замовчуванням, так і для статей користувача)
  const renderItem = ({ item }) => {
    const customUri = customImages[item.id];
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          setSelectedArticle({
            ...item,
            customUri,
          })
        }
      >
        <Image
          source={customUri ? { uri: customUri } : item.image}
          style={styles.thumbImage}
        />
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Об’єднуємо статті за замовчуванням і статті користувача
  const combinedArticles = [...BULL_ARTICLES, ...userArticles];

  // Обробка вибору зображення для нового запису користувача
  const handlePickNewArticleImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', `Error: ${response.errorMessage}`);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const pickedImage = response.assets[0];
        setNewArticle((prev) => ({
          ...prev,
          image: { uri: pickedImage.uri },
        }));
      }
    });
  };

  // Збереження нового запису користувача
  const handleSaveNewArticle = async () => {
    if (
      !newArticle.name ||
      !newArticle.habitat ||
      !newArticle.description ||
      !newArticle.cultural ||
      !newArticle.image
    ) {
      Alert.alert('Missing Fields', 'Please fill in all fields and choose an image.');
      return;
    }
    // Генеруємо ідентифікатор (наприклад, використовуючи поточний timestamp)
    const articleId = Date.now().toString();
    const articleToAdd = {
      id: articleId,
      name: newArticle.name,
      habitat: newArticle.habitat,
      description: newArticle.description,
      cultural: newArticle.cultural,
      image: newArticle.image, // збережено як об’єкт з uri
    };const updatedUserArticles = [...userArticles, articleToAdd];
    setUserArticles(updatedUserArticles);
    await saveUserArticlesToStorage(updatedUserArticles);
    // Очистка форми та закриття модального вікна
    setNewArticle({
      name: '',
      habitat: '',
      description: '',
      cultural: '',
      image: null,
    });
    setModalVisible(false);
  };

  // Якщо стаття не вибрана, показуємо список записів із кнопкою додавання нового запису
  if (!selectedArticle) {
    return (
      <ImageBackground source={require('../assets/backimg.jpg')} style={styles.background}>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/back_button.png')} style={styles.backButtonImage} />
          </TouchableOpacity>
          <Text style={styles.mainHeader}>Bull Encyclopedia</Text>
          <View style={styles.container}>
            <FlatList
              data={combinedArticles}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>Add New Entry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Модальне вікно для додавання нового запису */}
        <Modal visible={modalVisible} animationType="slide">
  <ImageBackground source={require('../assets/backimg.jpg')} style={styles.background}>
    <SafeAreaView style={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.modalHeader}>Add New Encyclopedia Entry</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#555"
          value={newArticle.name}
          onChangeText={(text) => setNewArticle((prev) => ({ ...prev, name: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Habitat"
          placeholderTextColor="#555"
          value={newArticle.habitat}
          onChangeText={(text) => setNewArticle((prev) => ({ ...prev, habitat: text }))}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          placeholderTextColor="#555"
          multiline
          numberOfLines={4}
          value={newArticle.description}
          onChangeText={(text) => setNewArticle((prev) => ({ ...prev, description: text }))}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Cultural Significance"
          placeholderTextColor="#555"
          multiline
          numberOfLines={3}
          value={newArticle.cultural}
          onChangeText={(text) => setNewArticle((prev) => ({ ...prev, cultural: text }))}
        />

        <TouchableOpacity style={styles.menuButton} onPress={handlePickNewArticleImage}>
          <Text style={styles.menuButtonText}>
            {newArticle.image ? 'Change Image' : 'Pick Image'}
          </Text>
        </TouchableOpacity>
        {newArticle.image && (
          <Image source={newArticle.image} style={styles.newArticleImage} />
        )}

        <View style={styles.modalButtonsRow}>
          <TouchableOpacity style={styles.menuButton} onPress={handleSaveNewArticle}>
            <Text style={styles.menuButtonText}>Save Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setModalVisible(false);
              setNewArticle({ name: '', habitat: '', description: '', cultural: '', image: null });
            }}
          >
            <Text style={styles.menuButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  </ImageBackground>
</Modal>
      </ImageBackground>
    );
  }

  // Якщо стаття обрана, показуємо деталі запису
  const currentUri = selectedArticle.customUri
    ? { uri: selectedArticle.customUri }
    : selectedArticle.image;

  return (
    <ImageBackground source={require('../assets/backimg.jpg')} style={styles.background}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Text style={styles.mainHeader}>Bull Encyclopedia</Text>
          <Image source={currentUri} style={styles.headerImage} />
          <Text style={styles.articleTitle}>{selectedArticle.name}</Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.menuButton} onPress={handlePickPhoto}>
              <Text style={styles.menuButtonText}>Pick Photo from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleRestoreDefault}>
              <Text style={styles.menuButtonText}>Restore Default</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.subtitle}>Habitat:</Text>
            <Text style={styles.description}>{selectedArticle.habitat}</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.subtitle}>Description:</Text>
            <Text style={styles.description}>{selectedArticle.description}</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.subtitle}>Cultural Significance:</Text>
            <Text style={styles.description}>{selectedArticle.cultural}</Text>
          </View>
          <TouchableOpacity
            style={[styles.menuButton, { margin: 15, alignSelf: 'center' }]}
            onPress={() => setSelectedArticle(null)}
          >
            <Text style={styles.menuButtonText}>Back to List</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 60,
    zIndex: 2,
  },
  backButtonImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  mainHeader: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 60,
    color: '#5B4A3D', // Темный песочный
  },
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
    paddingTop: 20,
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(210, 230, 200, 0.9)', // Бледно-зеленый
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#AABB97',
  },
  thumbImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    padding: 5,
    fontWeight: '700',
    color: '#5B4A3D', // Темный песочный
  },
  headerImage: {
    borderRadius: 25,
    padding: 10,
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginTop: 10,
  },
  articleTitle: {
    fontSize: 30,
    fontWeight: '800',
    margin: 15,
    textAlign: 'center',
    color: '#5B4A3D', // Темный песочный
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  menuButton: {
    backgroundColor: 'rgba(196, 153, 133, 0.8)', // Приглушенный терракотовый
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
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
    fontSize: 16,
    color: '#FAF3EB', // Кремовый белый
  },
  textBlock: {
    backgroundColor: 'rgba(245, 234, 216, 0.8)', // Светлый песочно-кремовый
    borderColor: '#AABB97',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B4A3D', // Темный песочный
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#8A705E', // Теплый коричнево-зеленый
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F6F1E9', // Кремовый белый
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#5B4A3D', // Темный песочный
  },
  input: {
    backgroundColor: 'rgba(245, 234, 216, 0.8)', // Светлый песочно-кремовый
    borderWidth: 1,
    borderColor: '#AABB97',
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  newArticleImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});