import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, ImageBackground } from 'react-native';

const Loader = ({ onEnd }) => {
  const appearingAnim = useRef(new Animated.Value(0)).current; 
  const disappearingAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

   
    setTimeout(() => {
      Animated.timing(disappearingAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => onEnd()); 
    }, 8000);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/backimg.jpg')} 
      style={styles.backgroundImage}
    >
      <Animated.View
        style={[
          styles.loaderContainer,
          { opacity: disappearingAnim }, 
        ]}
      >
        <Animated.Text
          style={[
            styles.loaderText,
            { opacity: appearingAnim }, 
          ]}
        >
          Welcome
        </Animated.Text>
        <Animated.Text
          style={[
            styles.loaderText,
            { opacity: appearingAnim }, 
          ]}
        >
         to
        </Animated.Text>
        <Animated.Text
          style={[
            styles.loaderText,
            { opacity: appearingAnim }, 
          ]}
        >
        Bull Master
        </Animated.Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
   
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  loaderContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontWeight:'bold',
    textAlign: 'center',
    fontSize: 60,
    color: '#D4A373',
  },
});

export default Loader;