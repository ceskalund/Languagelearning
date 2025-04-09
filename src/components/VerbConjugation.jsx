// src/components/VerbConjugation.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import TenseSelector from './TenseSelector';
import { verbs as frenchVerbs } from '../data/french';
import { verbs as norwegianVerbs } from '../data/norwegian';
import SessionSummary from './SessionSummary';

// Playful feedback messages
const FEEDBACK_MESSAGES = {
  french: {
    correct: [
      "Magnifique! 🌟", 
      "Brillant! 🎉", 
      "Superbe! 💡", 
      "Parfait! 🏆", 
      "Tu es un génie des langues! ✨"
    ],
    partial: [
      "Presque! 🤏", 
      "Encore un petit effort! 💪", 
      "Bon essai! Continue! 🌱"
    ],
    incorrect: [
      "Oups! Essayons encore 🤔", 
      "Pas tout à fait... Réessaie! 🎯", 
      "L’apprentissage est un voyage! 🚀"
    ]
  },
  norwegian: {
    correct: [
      "Fantastisk! 🌟", 
      "Strålende! 🎉", 
      "Flott jobba! 💡", 
      "Perfekt! 🏆", 
      "Du er en språkekspert! ✨"
    ],
    partial: [
      "Nesten! 🤏", 
      "Du er på rett vei! 💪", 
      "Godt forsøk! Fortsett å øve! 🌱"
    ],
    incorrect: [
      "Oops! Prøv igjen 🤔", 
      "Ikke helt... Et forsøk til! 🎯", 
      "Læring er en reise! 🚀"
    ]
  }
};

const VerbConjugation = ({ language, sessionType, onScoreUpdate }) => {
  // State management (similar to previous implementation)
  const [gameStage, setGameStage] = useState('tenseSelection');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedTenses, setSelectedTenses] = useState(['Random']);
  const [timeLeft, setTimeLeft] = useState(300);
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 20;
  
  // Current question data
  const [currentVerb, setCurrentVerb] = useState(null);
  const [currentTense, setCurrentTense] = useState('');
  const [currentPronoun, setCurrentPronoun] = useState('');
  
  // User interaction
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [result, setResult] = useState({ 
    message: '', 
    status: '',
    emoji: ''
  });
  
  // Stats tracking
  const [score, setScore] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: [],
    incorrect: [],
    verbStats: {},
    tenseStats: {},
    pronounStats: {}
  });

  // Playful animations and sound effects
  const playSuccessAnimation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a2', '#fbb1bd', '#f9bec7']
    });
  };

  // Select a random feedback message
  const getRandomFeedback = (status) => {
    const messages = FEEDBACK_MESSAGES[status] || FEEDBACK_MESSAGES.incorrect;
    if (!messages || messages.length === 0) {
        return "!"; // Default message
    }
    return messages[Math.floor(Math.random() * messages.length)];
};
  // Fetch a random verb based on selected tenses
  const fetchRandomVerb = useCallback(() => {
    console.log("Fetching random verb for", language);
    
    // Get the correct verb data based on language
    const verbData = language.toLowerCase() === 'french' ? frenchVerbs : norwegianVerbs;
    
    if (!verbData || verbData.length === 0) {
      console.error("No verb data available for", language);
      return;
    }
    
    console.log(`Found ${verbData.length} verbs for ${language}`);
    
    // Reset question state
    setUserInput('');
    setAttempts(0);
    setShowCorrectAnswer(false);
    setResult({ message: '', status: '', emoji: '' });
    
    // Get random verb
    const randomIndex = Math.floor(Math.random() * verbData.length);
    const randomVerb = verbData[randomIndex];
    
    console.log("Selected verb:", randomVerb.infinitive);
    
    // Get conjugations
    const conjugations = randomVerb.conjugations;
    
    if (!conjugations) {
      console.error("Verb has no conjugations:", randomVerb.infinitive);
      return;
    }
    
    // Determine available tenses
    let availableTenses = Object.keys(conjugations);
    
    if (!selectedTenses.includes('Random')) {
      const filteredTenses = availableTenses.filter(tense => selectedTenses.includes(tense));
      if (filteredTenses.length > 0) {
        availableTenses = filteredTenses;
      }
    }
    
    if (availableTenses.length === 0) {
      console.error("No available tenses for verb:", randomVerb.infinitive);
      return;
    }
    
    // Get random tense and pronoun
    const randomTense = availableTenses[Math.floor(Math.random() * availableTenses.length)];
    const pronouns = Object.keys(conjugations[randomTense]);
    
    if (pronouns.length === 0) {
      console.error("No pronouns available for tense:", randomTense);
      return;
    }
    
    const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correctAnswer = conjugations[randomTense][randomPronoun];
    
    console.log("Setting up question:", {
      verb: randomVerb.infinitive,
      tense: randomTense,
      pronoun: randomPronoun,
      answer: correctAnswer
    });
    
    // Set current question
    setCurrentVerb({
      ...randomVerb,
      correctAnswer: correctAnswer
    });
    setCurrentTense(randomTense);
    setCurrentPronoun(randomPronoun);
  }, [language, selectedTenses]);


  // Start gameplay
  const startGameplay = () => {
    console.log("Starting gameplay with tenses:", selectedTenses);
    
    if (!selectedTenses || selectedTenses.length === 0) {
      setSelectedTenses(['Random']);
    }
    
    setGameStage('gameplay');
    setIsSessionActive(true);
    setTimeLeft(300);
    setQuestionCount(0);
    setScore(0);
    setSessionStats({
      correct: [],
      incorrect: [],
      verbStats: {},
      tenseStats: {},
      pronounStats: {}
    });
    
    setTimeout(() => {
      fetchRandomVerb();
    }, 50);
  };

  // Check user's answer with added playfulness
  const checkAnswer = () => {
    if (!isSessionActive || !currentVerb) return;

    const correctAnswer = currentVerb.correctAnswer;
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.toLowerCase();
    
    // First attempt
    if (attempts === 0) {
      if (isCorrect) {
        const feedbackMessage = getRandomFeedback('correct');
        setResult({
          message: feedbackMessage,
          status: 'correct',
          emoji: '🎉'
        });
        playSuccessAnimation();
        setScore(prevScore => prevScore + 1);
        updateStats(true);
        
        setTimeout(moveToNextQuestion, 1500);
      } else {
        setResult({
          message: getRandomFeedback('incorrect'),
          status: 'incorrect',
          emoji: '🤔'
        });
        setAttempts(1);
      }
    } 
    // Second attempt
    else if (attempts === 1) {
      if (isCorrect) {
        setResult({
          message: getRandomFeedback('partial'),
          status: 'partial',
          emoji: '👍'
        });
        setScore(prevScore => prevScore + 0.5);
        updateStats(true);
        
        setTimeout(moveToNextQuestion, 1500);
      } else {
        setResult({
          message: `The correct answer is: ${correctAnswer}`,
          status: 'incorrect',
          emoji: '📚'
        });
        setShowCorrectAnswer(true);
        updateStats(false);
      }
    }
    // "Type to remember" phase
    else if (showCorrectAnswer) {
      if (userInput.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        setResult({
          message: 'Keep learning! 🌱',
          status: 'info',
          emoji: '✨'
        });
        
        setTimeout(moveToNextQuestion, 1500);
      } else {
        setResult({
          message: `Please type exactly: ${correctAnswer}`,
          status: 'incorrect',
          emoji: '🤨'
        });
      }
    }
  };

  // Render methods with motion and playful animations
  const renderTenseSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="tense-selection-stage"
    >
      <div className="instructions">
        <motion.h3 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Verb Conjugation Adventure!
        </motion.h3>
        <p>Get ready to master verb conjugations in {language}!</p>
        <p>Two attempts per question. Can you become a conjugation champion? 🏆</p>
      </div>
      
      <TenseSelector 
        language={language} 
        selectedTenses={selectedTenses} 
        setSelectedTenses={setSelectedTenses} 
      />
      
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGameplay} 
        className="start-game-btn"
      >
        Start Your Language Quest! 🚀
      </motion.button>
    </motion.div>
  );

  // Move to next question or end session
  const moveToNextQuestion = () => {
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    if (sessionType === 'questions' && newQuestionCount >= maxQuestions) {
      endSession();
    } else {
      fetchRandomVerb();
    }
  };

  // End session and show summary
  const endSession = () => {
    setIsSessionActive(false);
    setGameStage('summary');
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  // Update stats
  const updateStats = (isCorrect) => {
    if (!currentVerb || !currentTense || !currentPronoun) return;

    setSessionStats(prevStats => {
      const verbKey = currentVerb.infinitive;
      const tenseKey = currentTense;
      const pronounKey = currentPronoun;
      
      const questionInfo = {
        verb: verbKey,
        pronoun: pronounKey,
        tense: tenseKey,
        correctAnswer: currentVerb.correctAnswer,
        userAnswer: userInput,
        attempts: attempts + 1
      };
      
      return {
        correct: isCorrect ? [...prevStats.correct, questionInfo] : prevStats.correct,
        incorrect: !isCorrect ? [...prevStats.incorrect, questionInfo] : prevStats.incorrect,
        verbStats: {
          ...prevStats.verbStats,
          [verbKey]: {
            total: (prevStats.verbStats[verbKey]?.total || 0) + 1,
            correct: (prevStats.verbStats[verbKey]?.correct || 0) + (isCorrect ? 1 : 0)
          }
        },
        tenseStats: {
          ...prevStats.tenseStats,
          [tenseKey]: {
            total: (prevStats.tenseStats[tenseKey]?.total || 0) + 1,
            correct: (prevStats.tenseStats[tenseKey]?.correct || 0) + (isCorrect ? 1 : 0)
          }
        },
        pronounStats: {
          ...prevStats.pronounStats,
          [pronounKey]: {
            total: (prevStats.pronounStats[pronounKey]?.total || 0) + 1,
            correct: (prevStats.pronounStats[pronounKey]?.correct || 0) + (isCorrect ? 1 : 0)
          }
        }
      };
    });
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    if (gameStage !== 'gameplay' || !isSessionActive || sessionType !== 'timed') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStage, isSessionActive, sessionType]);

  // Update parent score
  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  }, [score, onScoreUpdate]);

  // Render game stages
  const renderGameplay = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="gameplay-stage"
    >
      <div className="session-info">
        {sessionType === 'timed' && (
          <div className="timer">
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}
        {sessionType === 'questions' && (
          <div className="question-counter">
            <span>Question: {questionCount + 1}/{maxQuestions}</span>
          </div>
        )}
        <div className="score">
          <span>Score: {score}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={endSession}
          className="end-session-btn"
        >
          End Session
        </motion.button>
      </div>

      {currentVerb ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="question-area"
        >
          <div className="verb-info">
            <h3>{currentVerb.infinitive}</h3>
          </div>
          
          <div className="conjugation-task">
            <div className="task-details">
              <p><strong>Tense:</strong> {currentTense}</p>
              <p><strong>Pronoun:</strong> {currentPronoun}</p>
            </div>
            
            <div className="answer-section">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="input-area"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={showCorrectAnswer ? "Type the correct answer" : "Type your answer"}
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkAnswer}
                >
                  {showCorrectAnswer ? "Continue" : "Check"}
                </motion.button>
              </motion.div>

              {result.message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`feedback ${result.status}`}
                >
                  <span className="emoji">{result.emoji}</span>
                  <span className="message">{result.message}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="loading">Loading question...</div>
      )}
    </motion.div>
  );

  return (
    <div className="verb-conjugation">
      <AnimatePresence mode="wait">
        {gameStage === 'tenseSelection' && renderTenseSelection()}
        {gameStage === 'gameplay' && renderGameplay()}
        {gameStage === 'summary' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <SessionSummary
              stats={sessionStats}
              score={score}
              maxQuestions={questionCount}
              sessionType={sessionType}
              language={language}
              onRestart={startGameplay}
              onChangeSettings={() => setGameStage('tenseSelection')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerbConjugation;
