import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenu from './Components/MainMenu';
import Settings from './Components/Settings';
import Loader from './Components/Loader'; 
import WallpapersSreen from './Components/WallpapersSreen';
import BullEncyclopedia from './Components/BullEncyclopedia';
import GamesScreen from './Components/GamesScreen';
import Photobook from './Components/Photobook';
import Map from './Components/Map'

import { AudioProvider } from './Components/AudioContext'; 
import { VibrationProvider } from './Components/VibrationContext';
import { CoinProvider } from './Components/CoinContext'; 

const Stack = createStackNavigator();

const App = () => {
  const [louderIsEnded, setLouderIsEnded] = useState(false); 

  return (
    <AudioProvider>
      <VibrationProvider>
        <CoinProvider> 
          <NavigationContainer>
            {!louderIsEnded ? (
              <Loader onEnd={() => setLouderIsEnded(true)} />
            ) : (
              <Stack.Navigator initialRouteName="MainMenu">
                <Stack.Screen name="MainMenu" component={MainMenu} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                <Stack.Screen name="WallpapersScreen" component={WallpapersSreen} options={{ headerShown: false }} />
                <Stack.Screen name="BullEncyclopedia" component={BullEncyclopedia} options={{ headerShown: false }} />
                <Stack.Screen name="GamesScreen" component={GamesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Photobook" component={Photobook} options={{ headerShown: false }} />
                <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
              </Stack.Navigator>
            )}
          </NavigationContainer>
        </CoinProvider>
      </VibrationProvider>
    </AudioProvider>
  );
};

export default App;