import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CoinProvider } from './Components/CoinContext'; 
import { useCoins } from './CoinContext';
const BULL_QUESTIONS = [
  {
    id: '1',
    question: 'What color are bulls most attracted to during bullfights?',
    answers: ['Blue', 'Red', 'Movement*'],
    correct: 2,
  },
  {
    id: '2',
    question: 'Which bull breed holds the record for the largest horns?',
    answers: ['Brahman', 'Ankole-Watusi*', 'Hereford'],
    correct: 1,
  },
  {
    id: '3',
    question: 'What is the Taurus constellation inspired by?',
    answers: [
      'A mythical bird',
      'A Greek myth about Zeus transforming into a bull*',
      "A warrior's shield"
    ],
    correct: 1,
  },
  {
    id: '4',
    question: 'Where was the oldest bull statue discovered?',
    answers: ['Egypt', 'Turkey*', 'Greece'],
    correct: 1,
  },
  {
    id: '5',
    question: 'How much grass does a bull typically eat daily?',
    answers: ['20 pounds', '30 pounds', '40 pounds*'],
    correct: 2,
  },
  {
    id: '6',
    question: 'Which country is famous for the Running of the Bulls?',
    answers: ['Portugal', 'Spain*', 'Mexico'],
    correct: 1,
  },
  {
    id: '7',
    question: 'What is the sacred bull in Hinduism called?',
    answers: ['Nandi*', 'Ganesha', 'Arjuna'],
    correct: 0,
  },
  {
    id: '8',
    question: 'Which breed of bull is specifically bred for bullfighting?',
    answers: ['Limousin', 'Spanish Fighting Bull*', 'Charolais'],
    correct: 1,
  },
  {
    id: '9',
    question: 'What was the weight of the heaviest recorded bull, Trigger?',
    answers: ['3,200 pounds', '3,836 pounds*', '4,000 pounds'],
    correct: 1,
  },
  {
    id: '10',
    question: 'Which bull-related festival dates back to the 14th century?',
    answers: ['La Tomatina', 'Running of the Bulls in Pamplona*', 'Carnival de Rio'],
    correct: 1,
  },
  {
    id: '11',
    question: 'How long have water buffaloes been domesticated?',
    answers: ['2,000 years', '5,000 years*', '7,000 years'],
    correct: 1,
  },
  {
    id: '12',
    question: 'What type of diet do bulls follow?',
    answers: ['Herbivore*', 'Carnivore', 'Omnivore'],
    correct: 0,
  },
  {
    id: '13',
    question: 'What is the role of Nandi the bull in Hinduism?',
    answers: ['A guardian of temples', 'The sacred vehicle of Lord Shiva*', 'A fertility symbol'],
    correct: 1,
  },
  {
    id: '14',
    question: 'Which celestial constellation represents a bull?',
    answers: ['Pegasus', 'Taurus*', 'Orion'],
    correct: 1,
  },
  {
    id: '15',
    question: 'Which bull breed is most commonly used in rodeos for bucking?',
    answers: ['Brangus', 'Brahman*', 'Dexter'],
    correct: 1,
  },
  {
    id: '16',
    question: "What is a bull’s reaction to the color red?",
    answers: [
      'Aggression toward the color',
      'Indifference; they’re colorblind to red*',
      'Attraction due to its brightness'
    ],
    correct: 1,
  },
  {
    id: '17',
    question: 'What does the bull symbolize in many cultures?',
    answers: ['Weakness', 'Power, fertility, and strength*', 'Darkness'],
    correct: 1,
  },
  {
    id: '18',
    question: 'How many feet can the horns of the Ankole-Watusi bull span?',
    answers: ['6 feet', '8 feet*', '10 feet'],
    correct: 1,
  },
  {
    id: '19',
    question: 'Where is the Ankole-Watusi bull originally from?',
    answers: ['Asia', 'Africa*', 'South America'],
    correct: 1,
  },
  {
    id: '20',
    question: 'What is bull riding considered in rodeos?',
    answers: ['The easiest event', 'One of the most dangerous sports*', 'A traditional farming activity'],
    correct: 1,
  },
];
// Список экранов
const SCREENS = {
  MENU: 'menu',
  QUIZ: 'quiz',
  ARENA: 'arena',
  SCORE: 'score', // экран, где показываем общий счёт
};

// Размер экрана
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');


const initArenaWorld = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;

  const world = engine.world;

  const bullBody = Matter.Bodies.rectangle(
    WIDTH / 2,
    HEIGHT - 80,
    60,
    60,
    { label: 'Bull' }
  );

  const flagBody = Matter.Bodies.rectangle(-9999, -9999, 40, 40, {
    label: 'Flag',
    isSensor: true,
  });

  // Стены слева / справа
  const leftWall = Matter.Bodies.rectangle(-10, HEIGHT / 2, 20, HEIGHT, {
    label: 'LeftWall',
    isStatic: true,
  });
  const rightWall = Matter.Bodies.rectangle(WIDTH + 10, HEIGHT / 2, 20, HEIGHT, {
    label: 'RightWall',
    isStatic: true,
  });

  Matter.World.add(world, [bullBody, flagBody, leftWall, rightWall]);

  return { engine, world, bullBody, flagBody };
};

// =============== РЕНДЕРЕРЫ ===============
const BullRenderer = (props) => {
  const { body, size = [60, 60] } = props;
  if (!body) return null;
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <Image
      source={require('../assets/bull.png')} 
      style={{
    
        position: 'absolute',
        left: x,
        top: y,
        width: size[0],
        height: size[1],
        resizeMode: 'contain',
      }}
    />
  );
};

const FlagRenderer = (props) => {
  const { body, size = [40, 40] } = props;
  if (!body) return null;
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <Image
      source={require('../assets/red_flag.png')} // замените путь
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size[0],
        height: size[1],
        resizeMode: 'contain',
      }}
    />
  );
};

// =============== СИСТЕМЫ (BULL ARENA) ===============

// Бык движется вверх (speedY), при достижении верха -> телепорт вниз
const MoveSystem = (entities, { time }) => {
  const engine = entities.physics.engine;
  const bull = entities.bull;
  if (!bull || !bull.body) return entities;

  const dt = time.delta;
  const velocityY = -bull.speedY;
  Matter.Body.setVelocity(bull.body, {
    x: bull.body.velocity.x,
    y: velocityY,
  });

  // Телепорт, если y < 0
  if (bull.body.position.y < 20) {
    Matter.Body.setPosition(bull.body, {
      x: bull.body.position.x ,
      y: HEIGHT - 10,
    });
  }

  Matter.Engine.update(engine, dt);
  return entities;
};

const FlagSystem = (entities, { time, dispatch }) => {
    const engine = entities.physics.engine;
    const bullBody = entities.bull.body;
    const flagBody = entities.flag.body;
    if (!bullBody || !flagBody) return entities;
  
    const now = Date.now();
    if (!entities.flag.nextSpawn) {
      entities.flag.nextSpawn = now + 2000;
    }
    if (now >= entities.flag.nextSpawn) {
      const randX = Math.random() * (WIDTH - 60) + 30;
      const randY = Math.random() * (HEIGHT * 0.6) + 20;
      Matter.Body.setPosition(flagBody, { x: randX, y: randY });
      entities.flag.nextSpawn = now + 2000 + Math.random() * 3000;
    }
  
    const dx = bullBody.position.x - flagBody.position.x;
    const dy = bullBody.position.y - flagBody.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    console.log('Distance between bull and flag:', dist);
   
    if (dist < 60) { 
      console.log('Collision detected! Dispatching score event');
      dispatch({ type: 'score-flag' });
      Matter.Body.setPosition(flagBody, { x: -9999, y: -9999 });
    }
  
    Matter.Engine.update(engine, time.delta);
    return entities;
  };
  
  const ControlSystem = (entities, { events }) => {
    const bull = entities.bull;
    if (!bull || !bull.body) return entities;
  
    events.forEach((e) => {
      console.log('Received event in ControlSystem:', e.type);
      switch (e.type) {
        case 'left':
          Matter.Body.setVelocity(bull.body, {
            x: -3,
            y: bull.body.velocity.y,
          });
          break;
        case 'right':
          Matter.Body.setVelocity(bull.body, {
            x: 3,
            y: bull.body.velocity.y,
          });
          break;
        case 'dash':
          bull.speedY += 1;
          break;
        case 'slow':
          bull.speedY = Math.max(1, bull.speedY - 1);
          break;
          case 'score-flag': {
            entities.gameState.score += 10;
            // Например, каждые 50 очков – +1 coin
            const oldCoins = Math.floor((entities.gameState.score - 10) / 50);
            const newCoins = Math.floor(entities.gameState.score / 50);
            if (newCoins > oldCoins) {
              entities.gameState.coins += newCoins - oldCoins;
            }
            break;
          }
        default:
          break;
      }
    });
  
    return entities;
  };



// Пример сохранения и загрузки результатов
const STORAGE_KEY = 'BULL_SCORE';
async function saveScore(score, coins) {
  try {
    const data = { score, coins };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.log('Save error:', err);
  }
}
async function loadScore() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return { score: 0, coins: 0 };
  } catch (err) {
    console.log('Load error:', err);
    return { score: 0, coins: 0 };
  }
}

// Режимы квиза: до первой ошибки или до конца вопросов
const MODE_FIRST_MISTAKE = 'firstMistake';
const MODE_ALL = 'all';

function QuizScreen({ onQuit, totalScore, setTotalScore, coins, setCoins }) {
  const [mode, setMode] = useState(null); // Выбор режима: 'firstMistake' или 'all'
  const [index, setIndex] = useState(0);
  const [scoreLocal, setScoreLocal] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Индекс выбранного варианта
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean } для показа подсветки

  // Если режим ещё не выбран, отобразим выбор
  if (!mode) {
    return (
      <View style={[styles.containerr, styles.center]}>
        <Text style={styles.header}>Choose Quiz Mode</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMode(MODE_FIRST_MISTAKE)}
        >
          <Text style={styles.menuButtonText}>Until First Mistake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMode(MODE_ALL)}
        >
          <Text style={styles.menuButtonText}>All Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, { marginTop: 20 }]} onPress={onQuit}>
          <Text style={styles.menuButtonText}>Quit Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = BULL_QUESTIONS[index];

  // Если вопросов больше нет – выводим результаты квиза
  if (!currentQ) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.header}>Quiz Over</Text>
        <Text style={styles.question}>
          Points: {scoreLocal} / {BULL_QUESTIONS.length}
        </Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            const coinsEarned = scoreLocal * 2;
            const newTotal = totalScore + scoreLocal;
            setTotalScore(newTotal);
            const newCoins = coins + coinsEarned;
            setCoins(newCoins);
            saveScore(newTotal, newCoins).then(() => {
              onQuit();
            });
          }}
        >
          <Text style={styles.menuButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }  // Формируем три варианта ответа:
  // один правильный и два случайных неправильных.
  let options = [];
  {
    const correctOption = {
      text: currentQ.answers[currentQ.correct].replace('*', ''),
      isCorrect: true,
    };
    const wrongOptions = currentQ.answers
      .filter((_, idx) => idx !== currentQ.correct)
      .map(ans => ({ text: ans.replace('*', ''), isCorrect: false }));
    // Если неправильных вариантов меньше двух, используем все, иначе выбираем два случайных
    let selectedWrong = [];
    if (wrongOptions.length <= 2) {
      selectedWrong = wrongOptions;
    } else {
      // случайным образом выбираем два
      while (selectedWrong.length < 2) {
        const candidate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        if (!selectedWrong.find(opt => opt.text === candidate.text)) {
          selectedWrong.push(candidate);
        }
      }
    }
    options = [correctOption, ...selectedWrong];
    // Перемешиваем опции
    options.sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (option, optionIndex) => {
    // Если уже выбран вариант, игнорируем повторное нажатие
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setFeedback({ isCorrect: option.isCorrect });

    // Ждём 1 секунду, чтобы показать подсветку
    setTimeout(() => {
      if (option.isCorrect) {
        setScoreLocal(scoreLocal + 1);
      }
      // Если режим до первой ошибки и ответ неправильный
      if (mode === MODE_FIRST_MISTAKE && !option.isCorrect) {
        Alert.alert('Incorrect!', `Quiz ended. Your score: ${scoreLocal}`, [
          {
            text: 'OK',
            onPress: () => {
              const coinsEarned = scoreLocal * 2;
              const newTotal = totalScore + scoreLocal;
              setTotalScore(newTotal);
              const newCoins = coins + coinsEarned;
              setCoins(newCoins);
              saveScore(newTotal, newCoins).then(() => {
                onQuit();
              });
            },
          },
        ]);
      } else {
        // В режиме "all questions" или при правильном ответе в режиме "firstMistake"
        setIndex(index + 1);
        setSelectedOption(null);
        setFeedback(null);
      }
    }, 1000);
  };

  return (
    <View style={[styles.container, styles.center]}>
      <Text style={styles.header}>Bull Quiz</Text>
      <Text style={styles.question}>{currentQ.question}</Text>
      {options.map((option, idx) => {
        // Определяем стиль для варианта ответа
        let optionStyle = [styles.answerButton];
        if (selectedOption === idx) {
          optionStyle.push(feedback?.isCorrect ? styles.correct : styles.incorrect);
        }
        return (
          <TouchableOpacity key={idx} style={optionStyle} onPress={() => handleAnswer(option, idx)}>
            <Text style={styles.buttonText}>{option.text}</Text>
          </TouchableOpacity>
        );
      })}
      <Text style={styles.question}>Points: {scoreLocal}</Text>
      <TouchableOpacity style={[styles.menuButton, { marginTop: 20 }]} onPress={onQuit}>
        <Text style={styles.menuButtonText}>Quit Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}



// =============== ГЛАВНЫЙ КОМПОНЕНТ ===============
export default function GamesOneFile() {
  const navigation = useNavigation();
  const [screen, setScreen] = useState(SCREENS.MENU);
  // Общий счёт (score) и монеты (coins), сохраняются в AsyncStorage
  const {totalScore, setTotalScore} = useCoins();
  const {coins, setCoins} = useCoins();

  // Arena
  const [running, setRunning] = useState(true);
  const [gameState, setGameState] = useState({ score: 0, coins: 0 });
  const gameEngineRef = useRef(null);
  const { engine, world, bullBody, flagBody } = useRef(initArenaWorld()).current;
 const [arenaState, setArenaState] = useState({ score: 0, coins: 0 });
  // При первом рендере загружаем счёт из AsyncStorage
  useEffect(() => {
    loadScore().then(({ score, coins }) => {
      setTotalScore(score);
      setCoins(coins);
    });
  }, []);

  // Главное меню
  if (screen === SCREENS.MENU) {
    return (
      <ImageBackground source={require('../assets/backimg.jpg')} style={styles.bg}>
        <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../assets/back_button.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <View style={styles.container}>
         
            <Text style={styles.header}>Select Game</Text>
            

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Bull Arena
                setScreen(SCREENS.ARENA);
                setRunning(true);
              }}
            >
              <Text style={styles.buttonText}>Bull Arena</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setScreen(SCREENS.QUIZ)}>
              <Text style={styles.buttonText}>Bull Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4e342e' }]}
              onPress={() => setScreen(SCREENS.SCORE)} // экран Score
            >
              <Text style={styles.buttonText}>Score</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Экран Score (показывает общий счёт и монеты)
  if (screen === SCREENS.SCORE) {
    return (
      <ImageBackground source={require('../assets/backimg.jpg')} style={styles.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.header}>Global Score</Text>
            <View style={styles.infoBox}>
            <Text style={styles.infoText}>Score: {totalScore}</Text>
          </View>
          
          <View style={styles.coinsBox}>
            <Image
              source={require('../assets/coin.png')} // путь к изображению монеты
              style={styles.coinImage}
            />
            <Text style={styles.infoText}>Points: {coins}</Text>
          </View>


            <TouchableOpacity
              style={styles.button}
              onPress={() => setScreen(SCREENS.MENU)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
 
  // Экран Quiz
  if (screen === SCREENS.QUIZ) {
    return (
      <ImageBackground source={require('../assets/backimg.jpg')} style={styles.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          <QuizScreen
            onQuit={() => setScreen(SCREENS.MENU)}
            totalScore={totalScore}
            setTotalScore={setTotalScore}
            coins={coins}
            setCoins={setCoins}
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }// Bull Arena
  

  if (screen === SCREENS.ARENA) {
    const arenaEntities = {
      physics: { engine, world },
      gameState: arenaState, // передаём текущее состояние, а не новый объект с нулями
      bull: {
        body: bullBody,
        size: [60, 60],
        speedY: 2,
        renderer: BullRenderer,
      },
      flag: {
        body: flagBody,
        size: [40, 40],
        renderer: FlagRenderer,
      },
    };

    const onUpdateEntitiesArena = (ents) => {
      const st = ents.gameState;
      if (st.score !== arenaState.score || st.coins !== arenaState.coins) {
        setArenaState({ score: st.score, coins: st.coins });
      }
    };

    const onEndGame = () => {
      setRunning(false);
      const newTotal = totalScore + arenaState.score;
      const newCoins = coins + arenaState.coins;
      setTotalScore(newTotal);
      setCoins(newCoins);
      saveScore(newTotal, newCoins).then(() => {
        Alert.alert(
          'Game Over',
          `Score gained: ${arenaState.score}\nPoints gained: ${arenaState.coins}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScreen(SCREENS.MENU);
                setArenaState({ score: 0, coins: 0 });
              },
            },
          ]
        );
      });
    };

    return (
      <SafeAreaView style={{ flex: 1,  backgroundColor: 'rgba(255, 248, 225, 1)', }}>
        <View style={styles.back}>
         <TouchableOpacity style={styles.menuButton} onPress={onEndGame}>
          <Text style={styles.menuButtonText}>END</Text>
        </TouchableOpacity>
        </View>
    

        <ImageBackground
          source={require('../assets/bull_arena.jpg')}
          style={styles.gameBackground}
          resizeMode="cover"
        >
          <GameEngine
            ref={gameEngineRef}
            style={styles.gameContainer}
            systems={[MoveSystem, FlagSystem, ControlSystem]}
            entities={arenaEntities}
            running={running}
            onUpdate={onUpdateEntitiesArena}
          />
        </ImageBackground>
    
        {/* Контейнер для кнопок, растянутый на всю нижнюю часть */}
        <View style={styles.controlBarContainer}>
          <View style={styles.controlBar}>
            <TouchableOpacity
              style={styles.ctrlButton}
              onPress={() => gameEngineRef.current?.dispatch({ type: 'left' })}
            >
              <Text style={styles.ctrlButtonText}>Left</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctrlButton}
              onPress={() => gameEngineRef.current?.dispatch({ type: 'right' })}
            >
              <Text style={styles.ctrlButtonText}>Right</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctrlButton}
              onPress={() => gameEngineRef.current?.dispatch({ type: 'dash' })}
            >
              <Text style={styles.ctrlButtonText}>Dash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctrlButton}
              onPress={() => gameEngineRef.current?.dispatch({ type: 'slow' })}
            >
              <Text style={styles.ctrlButtonText}>Slow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
const styles = StyleSheet.create({
  back:{
    backgroundColor: 'rgba(255, 248, 225, 1)',
  },
  gameBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  controlBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Задайте фон, который будет «перекрывать» нижнюю safe area:
    backgroundColor: 'rgba(255, 248, 225, 1)',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop:20,
  },
  ctrlButton: {
    backgroundColor: 'rgba(209, 133, 133, 1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    top:-20,
  },
  ctrlButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,      // расстояние от верхней границы экрана
    left: 10,     // расстояние от левой границы экрана
    
    padding: 10,  // можно подстроить отступы по необходимости
  },
  backButtonImage: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 223, 186, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    alignSelf:'center',
    borderWidth: 2,
    borderColor: '#D4A373', // Коричнево-золотистый бордер
  },
  coinsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 223, 186, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center',
    alignSelf:'center',
    borderWidth: 2,
    borderColor: '#D4A373',
  },
  coinImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  infoText: {
    color: '#4E342E',
    fontSize: 20,
    fontWeight:'bold',
    textAlign: 'center',
  },

  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: 'rgba(255, 248, 225, 1)',


  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 12,
    marginTop:150,
  },
  containerr: {
    flex: 1,
    padding: 12,
    marginTop:10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: '#4E342E',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
  question: {
    color: '#4E342E',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(255, 223, 186, 0.8)',
    paddingVertical:10,
    paddingHorizontal:10,

    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    alignSelf:'center',
    borderWidth: 2,
    borderColor: '#D4A373',
  },
  
  button: {
    backgroundColor: 'rgba(209, 133, 133, 0.8)',
    padding: 12,
    marginVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A0522D',
    paddingVertical: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    
  },
  answerButton: {
    backgroundColor: 'rgba(209, 133, 133, 0.8)',
    padding: 12,
    marginVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A0522D',
    width: '100%',
    alignSelf:'center',
    alignItems:'center',

  },
  // Подсветка правильного варианта
  correct: {
    backgroundColor: 'rgba(0, 128, 0, 0.6)', // зеленый полупрозрачный
  },
  // Подсветка неправильного варианта
  incorrect: {
    backgroundColor: 'rgba(255, 0, 0, 0.6)', // красный полупрозрачный
  },
  // Игровой контейнер (если нужно для другой части приложения)
  gameContainer: {
    flex: 1,
  
  },

  menuButton: {
    backgroundColor: 'rgba(209, 133, 133, 1)',
  
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    alignSelf:'center',
    borderColor: '#A0522D',
    width: '90%',
  },
  menuButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFF',
  },
  topRow: {
    flexDirection: 'row',
    marginTop: 50,
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  coinsContainer: {
    backgroundColor: 'rgba(255, 223, 186, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D4A373',
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  settingsButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 223, 186, 0.8)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D4A373',
  },
  settingsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  verticalButton: {
    backgroundColor: 'rgba(85, 139, 47, 0.8)',
    marginVertical: 15,
    paddingVertical: 50,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B8E23',
  },
  verticalButtonText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#FFF8E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 248, 225, 0.9)',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6B4226',
  },
  modalText: {
    fontSize: 18,marginBottom: 20,
    color: '#4E342E',
  },
});