// src/components/GameModeSelector.jsx
import React from 'react';

const GameModeSelector = ({ onSelectMode }) => {
  return (
    <div className="game-mode-selector">
      <h2>Choose a Game Mode</h2>
      <button onClick={() => onSelectMode('verbConjugation')}>Verb Conjugation</button>
      <button onClick={() => onSelectMode('grammarTest')}>Grammar Test</button>
      <button onClick={() => onSelectMode('synonymIdentifier')}>Synonym Identifier</button>
    </div>
  );
};

export default GameModeSelector;

