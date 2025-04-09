// src/components/SynonymIdentifier.jsx
import React, { useState, useEffect } from 'react';

const SynonymIdentifier = ({ language, sessionType }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userSynonym, setUserSynonym] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [questionCount, setQuestionCount] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Fetch a random word from the data
  const fetchRandomWord = async () => {
    try {
      const data = await import(`../data/${language}`);
      const words = data.synonyms;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Handle session logic
  useEffect(() => {
    if (sessionType === 'timed') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      if (timeLeft === 0) {
        setIsSessionActive(false);
        clearInterval(timer);
      }

      return () => clearInterval(timer);
    } else if (sessionType === 'questions' && questionCount >= 20) {
      setIsSessionActive(false);
    }
  }, [sessionType, timeLeft, questionCount]);

  // Check user's synonym
  const checkSynonym = () => {
    if (!isSessionActive) return;

    if (currentWord.synonyms.includes(userSynonym.trim().toLowerCase())) {
      setResult('Correct!');
      setScore((prev) => prev + 1);
    } else {
      setResult(`Incorrect. Possible synonyms: ${currentWord.synonyms.join(', ')}`);
    }

    setQuestionCount((prev) => prev + 1);
    fetchRandomWord();
    setUserSynonym('');
  };

  // Start the session
  useEffect(() => {
    if (isSessionActive) {
      fetchRandomWord();
    }
  }, [isSessionActive]);

  return (
    <div className="synonym-identifier">
      <h2>Synonym Identifier</h2>
      {sessionType === 'timed' && <p>Time Left: {timeLeft} seconds</p>}
      {sessionType === 'questions' && <p>Questions Left: {20 - questionCount}</p>}
      <p>Score: {score}</p>

      {isSessionActive ? (
        currentWord && (
          <div>
            <p>Find a synonym for: {currentWord.word}</p>
            <input
              type="text"
              value={userSynonym}
              onChange={(e) => setUserSynonym(e.target.value)}
              placeholder="Enter a synonym"
            />
            <button onClick={checkSynonym}>Check</button>
            {result && <p>{result}</p>}
          </div>
        )
      ) : (
        <p>Session complete! Your final score is {score}.</p>
      )}
    </div>
  );
};

export default SynonymIdentifier;