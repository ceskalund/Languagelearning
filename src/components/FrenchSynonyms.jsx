// src/components/FrenchSynonyms.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const FrenchSynonyms = ({ sessionType, onScoreUpdate }) => {
  // State for session tracking
  const [gameStage, setGameStage] = useState('intro');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 20;
  
  // State for current question
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [usedWordIds, setUsedWordIds] = useState(new Set());
  const [incorrectWordIds, setIncorrectWordIds] = useState(new Set());
  
  // State for user interaction
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState({ 
    status: '',
    message: ''
  });
  const [readyForNextQuestion, setReadyForNextQuestion] = useState(false);
  
  // State for tracking score and session stats
  const [score, setScore] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: [],
    incorrect: [],
    words: {}
  });

  // French synonym data (this would normally be imported from a data file)
  const frenchSynonyms = [
    {
      id: 1,
      word: "Éclectique",
      options: [
        { id: "A", text: "Varié", correct: true },
        { id: "B", text: "Diversifié", correct: false },
        { id: "C", text: "Inhabituel", correct: false }
      ],
      nuance: "\"Varié\" refers to a variety of things, \"diversifié\" refers to something with a broad range or scope, while \"inhabituel\" refers to something uncommon or not usual, implying uniqueness."
    },
    {
      id: 2,
      word: "Apaiser",
      options: [
        { id: "A", text: "Calmer", correct: true },
        { id: "B", text: "Adoucir", correct: false },
        { id: "C", text: "Diminuer", correct: false }
      ],
      nuance: "\"Calmer\" means to bring tranquility or peace, \"adoucir\" means to soften or make less harsh, while \"diminuer\" means to reduce or decrease in intensity."
    },
    {
      id: 3,
      word: "Élégant",
      options: [
        { id: "A", text: "Chic", correct: false },
        { id: "B", text: "Raffiné", correct: true },
        { id: "C", text: "Luxueux", correct: false }
      ],
      nuance: "\"Raffiné\" emphasizes sophistication and refinement, \"chic\" emphasizes fashionable style, while \"luxueux\" emphasizes richness and opulence."
    },
    {
      id: 4,
      word: "Vague",
      options: [
        { id: "A", text: "Imprécis", correct: true },
        { id: "B", text: "Flou", correct: false },
        { id: "C", text: "Ambigu", correct: false }
      ],
      nuance: "\"Imprécis\" lacks precision, \"flou\" describes something visually or conceptually blurry, while \"ambigu\" suggests something that can be interpreted in multiple ways."
    },
    {
      id: 5,
      word: "Mélancolique",
      options: [
        { id: "A", text: "Triste", correct: false },
        { id: "B", text: "Nostalgique", correct: true },
        { id: "C", text: "Sombre", correct: false }
      ],
      nuance: "\"Nostalgique\" involves a wistful longing for the past, \"triste\" is a general term for sadness, while \"sombre\" suggests darkness or gloominess."
    },
    {
      id: 6,
      word: "Persévérer",
      options: [
        { id: "A", text: "Continuer", correct: false },
        { id: "B", text: "Persister", correct: true },
        { id: "C", text: "Maintenir", correct: false }
      ],
      nuance: "\"Persister\" implies determination despite difficulties, \"continuer\" simply means to go on, while \"maintenir\" means to keep or preserve something."
    },
    {
      id: 7,
      word: "Lumineux",
      options: [
        { id: "A", text: "Brillant", correct: true },
        { id: "B", text: "Éclatant", correct: false },
        { id: "C", text: "Radieux", correct: false }
      ],
      nuance: "\"Brillant\" describes something emitting strong light, \"éclatant\" suggests something dazzling or intense, while \"radieux\" often describes a warm, joyful brightness."
    },
    {
      id: 8,
      word: "Audacieux",
      options: [
        { id: "A", text: "Courageux", correct: false },
        { id: "B", text: "Téméraire", correct: false },
        { id: "C", text: "Hardi", correct: true }
      ],
      nuance: "\"Hardi\" suggests boldness and daring, \"courageux\" emphasizes bravery in the face of fear, while \"téméraire\" suggests recklessness."
    },
    {
      id: 9,
      word: "Bizarre",
      options: [
        { id: "A", text: "Étrange", correct: true },
        { id: "B", text: "Curieux", correct: false },
        { id: "C", text: "Singulier", correct: false }
      ],
      nuance: "\"Étrange\" describes something unusual that may cause discomfort, \"curieux\" can suggest something that arouses interest, while \"singulier\" emphasizes uniqueness."
    },
    {
      id: 10,
      word: "Fragile",
      options: [
        { id: "A", text: "Délicat", correct: true },
        { id: "B", text: "Faible", correct: false },
        { id: "C", text: "Vulnérable", correct: false }
      ],
      nuance: "\"Délicat\" suggests something requiring careful handling, \"faible\" emphasizes a lack of strength, while \"vulnérable\" suggests susceptibility to harm."
    },
    {
      id: 11,
      word: "Annoncer",
      options: [
        { id: "A", text: "Déclarer", correct: false },
        { id: "B", text: "Révéler", correct: false },
        { id: "C", text: "Proclamer", correct: true }
      ],
      nuance: "\"Proclamer\" suggests a formal or public announcement, \"déclarer\" is to state something clearly, while \"révéler\" means to disclose something previously unknown."
    },
    {
      id: 12,
      word: "Content",
      options: [
        { id: "A", text: "Heureux", correct: false },
        { id: "B", text: "Satisfait", correct: true },
        { id: "C", text: "Joyeux", correct: false }
      ],
      nuance: "\"Satisfait\" implies having one's needs or expectations met, \"heureux\" suggests a deeper feeling of happiness, while \"joyeux\" describes an outward expression of joy."
    },
    {
      id: 13,
      word: "Ennuyeux",
      options: [
        { id: "A", text: "Monotone", correct: true },
        { id: "B", text: "Lassant", correct: false },
        { id: "C", text: "Fade", correct: false }
      ],
      nuance: "\"Monotone\" emphasizes sameness and lack of variation, \"lassant\" suggests something that causes weariness over time, while \"fade\" suggests a lack of liveliness or flavor."
    },
    {
      id: 14,
      word: "Inquiet",
      options: [
        { id: "A", text: "Anxieux", correct: false },
        { id: "B", text: "Préoccupé", correct: true },
        { id: "C", text: "Soucieux", correct: false }
      ],
      nuance: "\"Préoccupé\" suggests being mentally absorbed by a concern, \"anxieux\" describes a stronger feeling of worry or anxiety, while \"soucieux\" suggests showing concern."
    },
    {
      id: 15,
      word: "Aimer",
      options: [
        { id: "A", text: "Adorer", correct: false },
        { id: "B", text: "Chérir", correct: true },
        { id: "C", text: "Apprécier", correct: false }
      ],
      nuance: "\"Chérir\" implies holding something dear or precious, \"adorer\" suggests an intense or passionate liking, while \"apprécier\" suggests a more measured positive evaluation."
    }
  ];

  // Get a random word that hasn't been used yet in this session, 
  // unless it was answered incorrectly
  const getRandomWord = () => {
    // Filter out words that have been used (except incorrect ones that should be repeated)
    const availableWords = frenchSynonyms.filter(word => 
      !usedWordIds.has(word.id) || incorrectWordIds.has(word.id)
    );

    // If all words have been used or we're out of words, show summary
    if (availableWords.length === 0) {
      endSession();
      return null;
    }

    // Select a random word from available words
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];

    // Prepare the options
    const shuffledOptions = [...selectedWord.options].sort(() => Math.random() - 0.5);
    
    // Set the current word and options
    setCurrentWord(selectedWord);
    setOptions(shuffledOptions);
    
    // Mark this word as used
    setUsedWordIds(prev => new Set([...prev, selectedWord.id]));
    
    // If this word was previously incorrect and is now being repeated,
    // remove it from the incorrectWordIds set
    if (incorrectWordIds.has(selectedWord.id)) {
      setIncorrectWordIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedWord.id);
        return newSet;
      });
    }

    // Reset the selected option and result
    setSelectedOption(null);
    setResult({ status: '', message: '' });
    setReadyForNextQuestion(false);

    return selectedWord;
  };

  // Start the game session
  const startSession = () => {
    setGameStage('gameplay');
    setIsSessionActive(true);
    setTimeLeft(300); // 5 minutes
    setQuestionCount(0);
    setScore(0);
    setSelectedOption(null);
    setUsedWordIds(new Set());
    setIncorrectWordIds(new Set());
    setSessionStats({
      correct: [],
      incorrect: [],
      words: {}
    });

    // Get the first random word
    getRandomWord();
  };

  // End the session and go to summary
  const endSession = () => {
    setIsSessionActive(false);
    setGameStage('summary');
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (selectedOption || !isSessionActive) return;
    
    setSelectedOption(option);
    
    // Find the correct option
    const correctOption = currentWord.options.find(opt => opt.correct);
    
    if (option.id === correctOption.id) {
      // Correct answer
      setResult({
        status: 'correct',
        message: 'Bravo! Votre réponse est correcte.'
      });
      
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update score
      setScore(prevScore => prevScore + 1);
      
      // Update stats
      updateStats(true);
      
      // Move to next question after a short delay
      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    } else {
      // Incorrect answer
      setResult({
        status: 'incorrect',
        message: `La bonne réponse est "${correctOption.text}".`
      });
      
      // Add to incorrect words to be repeated later
      setIncorrectWordIds(prev => new Set([...prev, currentWord.id]));
      
      // Update stats
      updateStats(false);
      
      // Move to next question after a longer delay to show the correct answer
      setTimeout(() => {
        moveToNextQuestion();
      }, 3000);
    }
  };

  // Move to the next question
  const moveToNextQuestion = () => {
    // Increment question count
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // Check if we've reached the max questions for question-based sessions
    if (sessionType === 'questions' && newQuestionCount >= maxQuestions) {
      endSession();
    } else {
      // Get the next random word
      getRandomWord();
    }
  };

  // Update session statistics
  const updateStats = (isCorrect) => {
    if (!currentWord) return;

    setSessionStats(prevStats => {
      const wordId = currentWord.id;
      const wordInfo = {
        word: currentWord.word,
        options: currentWord.options,
        selected: selectedOption,
        nuance: currentWord.nuance
      };
      
      return {
        correct: isCorrect 
          ? [...prevStats.correct, wordInfo] 
          : prevStats.correct,
        incorrect: !isCorrect 
          ? [...prevStats.incorrect, wordInfo] 
          : prevStats.incorrect,
        words: {
          ...prevStats.words,
          [wordId]: {
            total: (prevStats.words[wordId]?.total || 0) + 1,
            correct: (prevStats.words[wordId]?.correct || 0) + (isCorrect ? 1 : 0)
          }
        }
      };
    });
  };

  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timer effect for timed sessions
  useEffect(() => {
    if (!isSessionActive || sessionType !== 'timed') return;

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
  }, [isSessionActive, sessionType]);

  // Render intro/instruction screen
  const renderIntro = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="synonym-intro"
    >
      <h2>Synonymes français</h2>
      <div className="instructions">
        <p>Choisissez le synonyme le plus proche du mot donné.</p>
        <p>Faites attention aux nuances entre les mots similaires!</p>
        <p>Mode de jeu: {sessionType === 'timed' ? '5 minutes' : '20 questions'}</p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startSession}
        className="start-session-btn"
      >
        Commencer
      </motion.button>
    </motion.div>
  );

  // Render gameplay screen
  const renderGameplay = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="synonym-gameplay"
    >
      {/* Session info bar */}
      <div className="session-info">
        {sessionType === 'timed' && (
          <div className="timer">
            <span>Temps restant: {formatTime(timeLeft)}</span>
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
        <button onClick={endSession} className="end-session-btn">
          Terminer
        </button>
      </div>

      {/* Current word and options */}
      {currentWord && (
        <div className="word-container">
          <motion.h3 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="current-word"
          >
            {currentWord.word}
          </motion.h3>
          
          <div className="options-container">
            {options.map(option => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: options.indexOf(option) * 0.1 }}
                className={`option-btn ${selectedOption?.id === option.id 
                  ? (option.correct ? 'correct' : 'incorrect') 
                  : ''}`}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
              >
                <span className="option-letter">{option.id}:</span> {option.text}
              </motion.button>
            ))}
          </div>
          
          {/* Result feedback */}
          <AnimatePresence>
            {result.message && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`result-feedback ${result.status}`}
              >
                <p>{result.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Nuance explanation (shown after selection) */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="nuance-container"
              >
                <h4>Nuance:</h4>
                <p>{currentWord.nuance}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );

  // Render session summary screen
  const renderSummary = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="session-summary"
    >
      <h2>Résumé de la session</h2>
      
      <div className="summary-stats">
        <div className="stat-item">
          <p>Questions totales</p>
          <p className="stat-value">{questionCount}</p>
        </div>
        <div className="stat-item">
          <p>Réponses correctes</p>
          <p className="stat-value">{sessionStats.correct.length}</p>
        </div>
        <div className="stat-item">
          <p>Score final</p>
          <p className="stat-value">{score}</p>
        </div>
      </div>
      
      {/* List of incorrect answers for review */}
      {sessionStats.incorrect.length > 0 && (
        <div className="incorrect-answers">
          <h3>Révision des erreurs</h3>
          {sessionStats.incorrect.map((item, index) => (
            <div key={index} className="incorrect-item">
              <h4>{item.word}</h4>
              <div className="options-review">
                {item.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`review-option ${
                      option.correct ? 'correct' : (item.selected.id === option.id ? 'selected' : '')
                    }`}
                  >
                    <span className="option-letter">{option.id}:</span> {option.text}
                    {option.correct && <span className="correct-marker">✓</span>}
                  </div>
                ))}
              </div>
              <div className="nuance-review">
                <h5>Nuance:</h5>
                <p>{item.nuance}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="summary-actions">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSession}
          className="restart-btn"
        >
          Recommencer
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGameStage('intro')}
          className="back-btn"
        >
          Retour au menu
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="french-synonyms-container">
      <AnimatePresence mode="wait">
        {gameStage === 'intro' && renderIntro()}
        {gameStage === 'gameplay' && renderGameplay()}
        {gameStage === 'summary' && renderSummary()}
      </AnimatePresence>
    </div>
  );
};

export default FrenchSynonyms;