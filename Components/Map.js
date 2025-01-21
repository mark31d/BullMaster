import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Функция для генерации вершин многоугольника, аппроксимирующего окружность
const generatePolygonCoordinates = (center, radius, numberOfPoints = 30) => {
  const points = [];
  const earthRadius = 6378137; // радиус Земли в метрах
  const lat = center.latitude * Math.PI / 180;
  
  for (let i = 0; i < numberOfPoints; i++) {
    const angle = (i * 2 * Math.PI) / numberOfPoints;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);
    const deltaLat = dx / earthRadius;
    const deltaLng = dy / (earthRadius * Math.cos(lat));
    points.push({
      latitude: center.latitude + deltaLat * 180 / Math.PI,
      longitude: center.longitude + deltaLng * 180 / Math.PI,
    });
  }
  return points;
};

// Данные о зонах обитания различных видов быков
const BULL_ZONES = [
  {
    name: 'Spanish Fighting Bull',
    center: { latitude: 40.0, longitude: -4.0 }, // Испания
    radius: 150000,
    fillColor: 'rgba(255, 0, 0, 0.3)',
    strokeColor: 'rgba(255, 0, 0, 0.8)',
  },
  {
    name: 'Simmental Bull',
    center: { latitude: 46.8, longitude: 8.2 }, // Швейцария
    radius: 140000,
    fillColor: 'rgba(0, 255, 0, 0.3)',
    strokeColor: 'rgba(0, 255, 0, 0.8)',
  },
  {
    name: 'Zebu Bull',
    center: { latitude: 20.0, longitude: 77.0 }, // Южная Азия (Индия/Пакистан)
    radius: 130000,
    fillColor: 'rgba(0, 0, 255, 0.3)',
    strokeColor: 'rgba(0, 0, 255, 0.8)',
  },
  {
    name: 'Watusi Bull',
    center: { latitude: -1.0, longitude: 30.0 }, // Центральная/Восточная Африка
    radius: 160000,
    fillColor: 'rgba(255, 165, 0, 0.3)',
    strokeColor: 'rgba(255, 165, 0, 0.8)',
  },
  {
    name: 'Charolais Bull',
    center: { latitude: 47.0, longitude: 4.0 }, // Франция
    radius: 120000,
    fillColor: 'rgba(128, 0, 128, 0.3)',
    strokeColor: 'rgba(128, 0, 128, 0.8)',
  },
  {
    name: 'Texas Longhorn',
    center: { latitude: 31.0, longitude: -100.0 }, // Центральный Техас, США
    radius: 170000,
    fillColor: 'rgba(0, 128, 128, 0.3)',
    strokeColor: 'rgba(0, 128, 128, 0.8)',
  },
  {
    name: 'Angus Bull',
    center: { latitude: 45.0, longitude: -75.0 }, // Северная Америка (например, Канада)
    radius: 110000,
    fillColor: 'rgba(128, 128, 0, 0.3)',
    strokeColor: 'rgba(128, 128, 0, 0.8)',
  },
  {
    name: 'Hereford Bull',
    center: { latitude: 52.0, longitude: -1.2 }, // Англия
    radius: 100000,
    fillColor: 'rgba(255, 192, 203, 0.3)',
    strokeColor: 'rgba(255, 192, 203, 0.8)',
  },
  {
    name: 'Brahman Bull',
    center: { latitude: 21.0, longitude: 78.0 }, // Индия
    radius: 90000,
    fillColor: 'rgba(0, 0, 0, 0.3)',
    strokeColor: 'rgba(0, 0, 0, 0.8)',
  },
];

// Границы для зума
const MIN_LATITUDE_DELTA = 0.5;
const MAX_LATITUDE_DELTA = 80;
const MIN_LONGITUDE_DELTA = 0.5;
const MAX_LONGITUDE_DELTA = 80;

// Начальный регион (глобальный обзор)
const INITIAL_REGION = {
  latitude: 20,
  longitude: 0,
  latitudeDelta: 40,
  longitudeDelta: 80,
};

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [selectedZone, setSelectedZone] = useState(null);

  // Функция для увеличения зума с ограничениями
  const zoomIn = () => {
    setRegion(prevRegion => {
      const newLatDelta = prevRegion.latitudeDelta * 0.5;
      const newLngDelta = prevRegion.longitudeDelta * 0.5;
      return {
        ...prevRegion,
        latitudeDelta: newLatDelta < MIN_LATITUDE_DELTA ? MIN_LATITUDE_DELTA : newLatDelta,
        longitudeDelta: newLngDelta < MIN_LONGITUDE_DELTA ? MIN_LONGITUDE_DELTA : newLngDelta,
      };
    });
  };// Функция для уменьшения зума с ограничениями
  const zoomOut = () => {
    setRegion(prevRegion => {
      const newLatDelta = prevRegion.latitudeDelta * 2;
      const newLngDelta = prevRegion.longitudeDelta * 2;
      return {
        ...prevRegion,
        latitudeDelta: newLatDelta > MAX_LATITUDE_DELTA ? MAX_LATITUDE_DELTA : newLatDelta,
        longitudeDelta: newLngDelta > MAX_LONGITUDE_DELTA ? MAX_LONGITUDE_DELTA : newLngDelta,
      };
    });
  };

  // При нажатии на зону устанавливаем выбранную зону
  const onZonePress = (bullZone) => {
    setSelectedZone(bullZone);
  };

  return (
    <ImageBackground
      source={require('../assets/backimg.jpg')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Bull Habitat Zones</Text>
          
          {/* Карта занимает 75% высоты экрана */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              showsUserLocation={true}
            >
              {BULL_ZONES.map((zone, index) => {
                const polygonCoordinates = generatePolygonCoordinates(zone.center, zone.radius);
                return (
                  <Polygon
                    key={index}
                    coordinates={polygonCoordinates}
                    strokeColor={zone.strokeColor}
                    fillColor={zone.fillColor}
                    strokeWidth={2}
                    tappable={true}
                    onPress={() => onZonePress(zone)}
                  />
                );
              })}

              {/* Если выбрана зона, отображаем маркер с названием */}
              {selectedZone && (
                <Marker 
                  coordinate={selectedZone.center}
                  title={selectedZone.name}
                />
              )}
            </MapView>
            
            {/* Кнопки зума */}
            <View style={styles.zoomContainer}>
              <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
                <Text style={styles.zoomButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
                <Text style={styles.zoomButtonText}>–</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Под картой оставлена только кнопка Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: screenWidth * 0.07, // Немного меньше заголовка
    color: '#FFF',
    backgroundColor: 'rgba(209, 133, 133, 0.8)',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  mapContainer: {
    height: screenHeight * 0.75,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  zoomContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: 'rgba(209, 133, 133, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  zoomButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#4e342e',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default MapScreen;