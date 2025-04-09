// src/components/GrammarTest.jsx
import React, { useState, useEffect } from 'react';

const GrammarTest = ({ language, sessionType }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [questionCount, setQuestionCount] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Fetch a random grammar question from the data
  const fetchRandomQuestion = async () => {
    try {
      const data = await import(`../data/${language}`);
      const questions = data.grammarQuestions;
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion(randomQuestion);
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

  // Check user's answer
  const checkAnswer = () => {
    if (!isSessionActive) return;

    if (userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
      setResult('Correct!');
      setScore((prev) => prev + 1);
    } else {
      setResult(`Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`);
    }

    setQuestionCount((prev) => prev + 1);
    fetchRandomQuestion();
    setUserAnswer('');
  };

  // Start the session
  useEffect(() => {
    if (isSessionActive) {
      fetchRandomQuestion();
    }
  }, [isSessionActive]);

  return (
    <div className="grammar-test">
      <h2>Grammar Testing</h2>
      {sessionType === 'timed' && <p>Time Left: {timeLeft} seconds</p>}
      {sessionType === 'questions' && <p>Questions Left: {20 - questionCount}</p>}
      <p>Score: {score}</p>

      {isSessionActive ? (
        currentQuestion && (
          <div>
            <p>{currentQuestion.question}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
            />
            <button onClick={checkAnswer}>Check</button>
            {result && <p>{result}</p>}
          </div>
        )
      ) : (
        <p>Session complete! Your final score is {score}.</p>
      )}
    </div>
  );
};

export default GrammarTest;