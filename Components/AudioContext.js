import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const AudioContext = createContext();
let backgroundMusic = null;

export const AudioProvider = ({ children }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    backgroundMusic = new Sound(require('../assets/music.mp3'), (error) => {
      if (error) {
        console.log('error', error);
      } else {
        backgroundMusic.setNumberOfLoops(-1); 
        backgroundMusic.setVolume(volume);
        if (isMusicPlaying) {
          backgroundMusic.play();
        }
      }
    });
  
    return () => {
     
      if (backgroundMusic) {
        backgroundMusic.stop();
        backgroundMusic.release();
        backgroundMusic = null; 
      }
    };
  }, []);
  

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (backgroundMusic) {
          backgroundMusic.pause(); 
        }
      } else if (nextAppState === 'active') {
        if (isMusicPlaying && backgroundMusic) {
          backgroundMusic.play(); 
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove(); 
    };
  }, [isMusicPlaying]);

  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.setVolume(volume);
      if (isMusicPlaying) {
        backgroundMusic.play();
      } else {
        backgroundMusic.pause();
      }
    }
  }, [isMusicPlaying, volume]);

  return (
    <AudioContext.Provider value={{ isMusicPlaying, setIsMusicPlaying, volume, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);