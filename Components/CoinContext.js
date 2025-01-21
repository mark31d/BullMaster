import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'BULL_SCORE';

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  // Функция загрузки состояния из AsyncStorage
  const loadState = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const { coins: loadedCoins, score: loadedScore } = JSON.parse(storedData);
        setCoins(loadedCoins);
        setTotalScore(loadedScore);
      }
    } catch (err) {
      console.log('Error loading coin state:', err);
    }
  };

  // Функция сохранения состояния в AsyncStorage
  const saveState = async (newCoins, newScore) => {
    try {
      const data = { coins: newCoins, score: newScore };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.log('Error saving coin state:', err);
    }
  };

  // Загружаем состояние при монтировании
  useEffect(() => {
    loadState();
  }, []);

  // Сохраняем состояние каждый раз, когда coins или totalScore меняется
  useEffect(() => {
    saveState(coins, totalScore);
  }, [coins, totalScore]);

  // Функция сброса глобального состояния и сохранения новых (нулевых) значений
  const resetScores = async () => {
    setCoins(0);
    setTotalScore(0);
    await saveState(0, 0);
  };

  return (
    <CoinContext.Provider
      value={{ coins, setCoins, totalScore, setTotalScore, resetScores }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => useContext(CoinContext);