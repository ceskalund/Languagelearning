// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import GameModeSelector from './components/GameModeSelector';
import SessionTypeSelector from './components/SessionTypeSelector';
import VerbConjugation from './components/VerbConjugation';
import GrammarTest from './components/GrammarTest';
import SynonymIdentifier from './components/SynonymIdentifier';
import ResultDisplay from './components/ResultDisplay';

const App = () => {
  const [language, setLanguage] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [score, setScore] = useState(0);

  return (
    <Router>
<div className="app flex flex-col items-center justify-center min-h-screen">
<Header />
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
                <GameModeSelector onSelectMode={setGameMode} />
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
                <SessionTypeSelector onSelectSessionType={setSessionType} />
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
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Step 5: Result Display */}
          <Route
            path="/result"
            element={<ResultDisplay score={score} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;