// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import GameModeSelector from './components/GameModeSelector';
import SessionTypeSelector from './components/SessionTypeSelector';
import VerbConjugation from './components/VerbConjugation';
import GrammarTest from './components/GrammarTest';
import SynonymIdentifier from './components/SynonymIdentifier';
import ResultDisplay from './components/ResultDisplay';

// Import styles
import './styles/index.scss';
import './styles/VerbConjugator.css';
import './styles/FrenchSynonyms.css';
import './styles/NorwegianSynonyms.css';

const App = () => {
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage || null;
  });
  const [gameMode, setGameMode] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [score, setScore] = useState(0);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (language) {
      localStorage.setItem('selectedLanguage', language);
    } else {
      localStorage.removeItem('selectedLanguage');
    }
  }, [language]);

  // Reset game state when language changes
  useEffect(() => {
    setGameMode(null);
    setSessionType(null);
    setScore(0);
  }, [language]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <Router>
      <div className="app flex flex-col min-h-screen">
        <Header language={language} onLanguageChange={handleLanguageChange} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Step 1: Language Selection */}
            <Route
              path="/"
              element={
                !language ? (
                  <LanguageSelector onSelectLanguage={setLanguage} />
                ) : (
                  <Navigate to="/mode" />
                )
              }
            />

            {/* Step 2: Game Mode Selection */}
            <Route
              path="/mode"
              element={
                language && !gameMode ? (
                  <GameModeSelector 
                    onSelectMode={setGameMode}
                    language={language}
                  />
                ) : !language ? (
                  <Navigate to="/" />
                ) : (
                  <Navigate to="/session-type" />
                )
              }
            />

            {/* Step 3: Session Type Selection */}
            <Route
              path="/session-type"
              element={
                language && gameMode && !sessionType ? (
                  <SessionTypeSelector 
                    onSelectType={setSessionType}
                    language={language}
                    gameMode={gameMode}
                  />
                ) : !language ? (
                  <Navigate to="/" />
                ) : !gameMode ? (
                  <Navigate to="/mode" />
                ) : (
                  <Navigate to="/game" />
                )
              }
            />

            {/* Step 4: Game */}
            <Route
              path="/game"
              element={
                language && gameMode && sessionType ? (
                  <>
                    {gameMode === 'verbConjugation' && (
                      <VerbConjugation
                        language={language}
                        sessionType={sessionType}
                        onScoreUpdate={setScore}
                      />
                    )}
                    {gameMode === 'grammarTest' && (
                      <GrammarTest
                        language={language}
                        sessionType={sessionType}
                        onScoreUpdate={setScore}
                      />
                    )}
                    {gameMode === 'synonymIdentifier' && (
                      <SynonymIdentifier
                        language={language}
                        sessionType={sessionType}
                        onScoreUpdate={setScore}
                      />
                    )}
                  </>
                ) : !language ? (
                  <Navigate to="/" />
                ) : !gameMode ? (
                  <Navigate to="/mode" />
                ) : !sessionType ? (
                  <Navigate to="/session-type" />
                ) : null
              }
            />

            {/* Step 5: Result Display */}
            <Route
              path="/result"
              element={
                language && gameMode && sessionType ? (
                  <ResultDisplay 
                    score={score}
                    language={language}
                    gameMode={gameMode}
                    sessionType={sessionType}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;