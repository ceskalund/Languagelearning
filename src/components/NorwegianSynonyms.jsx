// src/components/NorwegianSynonyms.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const NorwegianSynonyms = ({ sessionType, onScoreUpdate }) => {
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
  
  // State for tracking score and session stats
  const [score, setScore] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: [],
    incorrect: [],
    words: {}
  });

  // Norwegian synonym data (this would normally be imported from a data file)
  const norwegianSynonyms = [
    {
      id: 1,
      word: "Vakker",
      options: [
        { id: "A", text: "Pen", correct: true },
        { id: "B", text: "Nydelig", correct: false },
        { id: "C", text: "Praktfull", correct: false }
      ],
      nuance: "\"Pen\" er mer hverdagslig enn \"nydelig\", mens \"praktfull\" er enda sterkere og mer storslått. (\"Pen\" is more everyday than \"nydelig\", while \"praktfull\" is even stronger and more magnificent.)"
    },
    {
      id: 2,
      word: "Rask",
      options: [
        { id: "A", text: "Kjapp", correct: true },
        { id: "B", text: "Hurtig", correct: false },
        { id: "C", text: "Lynrask", correct: false }
      ],
      nuance: "\"Kjapp\" refererer til noe som skjer på kort tid, \"hurtig\" fokuserer på fart, mens \"lynrask\" er ekstremt raskt. (\"Kjapp\" refers to something happening in a short time, \"hurtig\" focuses on speed, while \"lynrask\" is extremely fast.)"
    },
    {
      id: 3,
      word: "Stor",
      options: [
        { id: "A", text: "Enorm", correct: false },
        { id: "B", text: "Svær", correct: false },
        { id: "C", text: "Anselig", correct: true }
      ],
      nuance: "\"Anselig\" betyr betydelig stor, \"svær\" er mer uformelt og indikerer noe veldig stort, mens \"enorm\" er ekstremt stort. (\"Anselig\" means considerably large, \"svær\" is more informal and indicates something very big, while \"enorm\" is extremely large.)"
    },
    {
      id: 4,
      word: "Glad",
      options: [
        { id: "A", text: "Lykkelig", correct: false },
        { id: "B", text: "Fornøyd", correct: true },
        { id: "C", text: "Munter", correct: false }
      ],
      nuance: "\"Fornøyd\" indikerer tilfredshet, \"lykkelig\" er en dypere følelse av glede, mens \"munter\" fokuserer på humøret. (\"Fornøyd\" indicates satisfaction, \"lykkelig\" is a deeper feeling of happiness, while \"munter\" focuses on cheerfulness.)"
    },
    {
      id: 5,
      word: "Plutselig",
      options: [
        { id: "A", text: "Uventet", correct: false },
        { id: "B", text: "Brått", correct: true },
        { id: "C", text: "Overraskende", correct: false }
      ],
      nuance: "\"Brått\" fokuserer på at noe skjer raskt uten forvarsel, \"uventet\" fokuserer på mangel på forventning, mens \"overraskende\" fokuserer på reaksjonen. (\"Brått\" focuses on something happening quickly without warning, \"uventet\" focuses on lack of expectation, while \"overraskende\" focuses on the reaction.)"
    },
    {
      id: 6,
      word: "Vanskelig",
      options: [
        { id: "A", text: "Komplisert", correct: false },
        { id: "B", text: "Krevende", correct: true },
        { id: "C", text: "Problematisk", correct: false }
      ],
      nuance: "\"Krevende\" indikerer noe som krever innsats, \"komplisert\" fokuserer på noe med mange deler eller aspekter, mens \"problematisk\" antyder at noe skaper problemer. (\"Krevende\" indicates something requiring effort, \"komplisert\" focuses on something with many parts or aspects, while \"problematisk\" suggests something causing problems.)"
    },
    {
      id: 7,
      word: "Interessant",
      options: [
        { id: "A", text: "Spennende", correct: false },
        { id: "B", text: "Fascinerende", correct: false },
        { id: "C", text: "Fengslende", correct: true }
      ],
      nuance: "\"Fengslende\" betyr noe som holder oppmerksomheten din, \"spennende\" antyder spenning eller forventning, mens \"fascinerende\" indikerer dyp interesse. (\"Fengslende\" means something that holds your attention, \"spennende\" suggests excitement or anticipation, while \"fascinerende\" indicates deep interest.)"
    },
    {
      id: 8,
      word: "Modig",
      options: [
        { id: "A", text: "Tapper", correct: true },
        { id: "B", text: "Dristig", correct: false },
        { id: "C", text: "Uredd", correct: false }
      ],
      nuance: "\"Tapper\" beskriver mot til tross for frykt, \"dristig\" innebærer å ta risiko, mens \"uredd\" betyr uten frykt. (\"Tapper\" describes courage despite fear, \"dristig\" implies taking risks, while \"uredd\" means without fear.)"
    },
    {
      id: 9,
      word: "Lei",
      options: [
        { id: "A", text: "Irritert", correct: false },
        { id: "B", text: "Misfornøyd", correct: false },
        { id: "C", text: "Oppgitt", correct: true }
      ],
      nuance: "\"Oppgitt\" beskriver en følelse av resignasjon, \"irritert\" fokuserer på irritasjon, mens \"misfornøyd\" indikerer generell utilfredshet. (\"Oppgitt\" describes a feeling of resignation, \"irritert\" focuses on annoyance, while \"misfornøyd\" indicates general dissatisfaction.)"
    },
    {
      id: 10,
      word: "Rolig",
      options: [
        { id: "A", text: "Fredelig", correct: false },
        { id: "B", text: "Avslappet", correct: true },
        { id: "C", text: "Stille", correct: false }
      ],
      nuance: "\"Avslappet\" refererer til en mental tilstand, \"fredelig\" fokuserer mer på omgivelsene, mens \"stille\" refererer hovedsakelig til fravær av lyd. (\"Avslappet\" refers to a mental state, \"fredelig\" focuses more on the surroundings, while \"stille\" primarily refers to absence of sound.)"
    },
    {
      id: 11,
      word: "Skremmende",
      options: [
        { id: "A", text: "Fryktelig", correct: false },
        { id: "B", text: "Urovekkende", correct: true },
        { id: "C", text: "Skummel", correct: false }
      ],
      nuance: "\"Urovekkende\" betyr noe som skaper uro eller bekymring, \"fryktelig\" er intenst skremmende, mens \"skummel\" ofte brukes om noe som virker mystisk og truende. (\"Urovekkende\" means something that creates unease or concern, \"fryktelig\" is intensely frightening, while \"skummel\" is often used for something that seems mysterious and threatening.)"
    },
    {
      id: 12,
      word: "Viktig",
      options: [
        { id: "A", text: "Vesentlig", correct: true },
        { id: "B", text: "Avgjørende", correct: false },
        { id: "C", text: "Betydningsfull", correct: false }
      ],
      nuance: "\"Vesentlig\" betyr noe som er grunnleggende eller essensielt, \"avgjørende\" impliserer noe som har kritisk betydning, mens \"betydningsfull\" indikerer noe som har stor innvirkning. (\"Vesentlig\" means something that is fundamental or essential, \"avgjørende\" implies something critical, while \"betydningsfull\" indicates something having significant impact.)"
    },
    {
      id: 13,
      word: "Rar",
      options: [
        { id: "A", text: "Merkelig", correct: true },
        { id: "B", text: "Underlig", correct: false },
        { id: "C", text: "Uvanlig", correct: false }
      ],
      nuance: "\"Merkelig\" beskriver noe som virker fremmed eller uforklarlig, \"underlig\" kan indikere noe mystisk, mens \"uvanlig\" bare betyr noe som ikke er vanlig. (\"Merkelig\" describes something that seems alien or inexplicable, \"underlig\" can indicate something mystical, while \"uvanlig\" just means something that isn't common.)"
    },
    {
      id: 14,
      word: "Sliten",
      options: [
        { id: "A", text: "Trøtt", correct: false },
        { id: "B", text: "Utmattet", correct: false },
        { id: "C", text: "Utslitt", correct: true }
      ],
      nuance: "\"Utslitt\" indikerer ekstrem tretthet, \"trøtt\" er en mildere form for tretthet, mens \"utmattet\" innebærer uttømming av energi. (\"Utslitt\" indicates extreme tiredness, \"trøtt\" is a milder form of tiredness, while \"utmattet\" implies depletion of energy.)"
    },
    {
      id: 15,
      word: "Snakke",
      options: [
        { id: "A", text: "Prate", correct: true },
        { id: "B", text: "Konversere", correct: false },
        { id: "C", text: "Diskutere", correct: false }
      ],
      nuance: "\"Prate\" er den mest uformelle og hverdagslige varianten, \"konversere\" er mer formelt og betyr å føre en samtale, mens \"diskutere\" innebærer å utveksle synspunkter om et emne. (\"Prate\" is the most informal and everyday variant, \"konversere\" is more formal and means to have a conversation, while \"diskutere\" involves exchanging views about a topic.)"
    }
  ];

  // Get a random word that hasn't been used yet in this session, 
  // unless it was answered incorrectly
  const getRandomWord = () => {
    // Filter out words that have been used (except incorrect ones that should be repeated)
    const availableWords = norwegianSynonyms.filter(word => 
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
        message: 'Bra jobba! Svaret ditt er riktig.'
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
        message: `Det riktige svaret er "${correctOption.text}".`
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
      <h2>Norske Synonymer</h2>
      <div className="instructions">
        <p>Velg det synonymet som er nærmest ordet som blir vist.</p>
        <p>Vær oppmerksom på nyansene mellom lignende ord!</p>
        <p>Spillmodus: {sessionType === 'timed' ? '5 minutter' : '20 spørsmål'}</p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startSession}
        className="start-session-btn"
      >
        Start
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
            <span>Tid igjen: {formatTime(timeLeft)}</span>
          </div>
        )}
        {sessionType === 'questions' && (
          <div className="question-counter">
            <span>Spørsmål: {questionCount + 1}/{maxQuestions}</span>
          </div>
        )}
        <div className="score">
          <span>Poeng: {score}</span>
        </div>
        <button onClick={endSession} className="end-session-btn">
          Avslutt
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
                <h4>Nyanse:</h4>
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
      <h2>Øktsammendrag</h2>
      
      <div className="summary-stats">
        <div className="stat-item">
          <p>Totale spørsmål</p>
          <p className="stat-value">{questionCount}</p>
        </div>
        <div className="stat-item">
          <p>Riktige svar</p>
          <p className="stat-value">{sessionStats.correct.length}</p>
        </div>
        <div className="stat-item">
          <p>Endelig poengsum</p>
          <p className="stat-value">{score}</p>
        </div>
      </div>
      
      {/* List of incorrect answers for review */}
      {sessionStats.incorrect.length > 0 && (
        <div className="incorrect-answers">
          <h3>Gjennomgang av feil</h3>
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
                <h5>Nyanse:</h5>
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
          Prøv igjen
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGameStage('intro')}
          className="back-btn"
        >
          Tilbake til menyen
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="norwegian-synonyms-container">
      <AnimatePresence mode="wait">
        {gameStage === 'intro' && renderIntro()}
        {gameStage === 'gameplay' && renderGameplay()}
        {gameStage === 'summary' && renderSummary()}
      </AnimatePresence>
    </div>
  );
};

export default NorwegianSynonyms;
