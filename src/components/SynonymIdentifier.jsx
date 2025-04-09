// src/components/SynonymIdentifier.jsx
import React, { useState, useEffect } from 'react';
import FrenchSynonyms from './FrenchSynonyms';
import NorwegianSynonyms from './NorwegianSynonyms';

const SynonymIdentifier = ({ language, sessionType, onScoreUpdate }) => {
  // State to track the overall score
  const [score, setScore] = useState(0);
  
  // Update parent component's score when our score changes
  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  }, [score, onScoreUpdate]);

  // Handle score updates from child components
  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  return (
    <div className="synonym-identifier">
      <h2>Synonym Identifier</h2>
      
      {language === 'french' && (
        <FrenchSynonyms 
          sessionType={sessionType} 
          onScoreUpdate={handleScoreUpdate} 
        />
      )}
      
      {language === 'norwegian' && (
        <NorwegianSynonyms 
          sessionType={sessionType} 
          onScoreUpdate={handleScoreUpdate} 
        />
      )}
    </div>
  );
};

export default SynonymIdentifier;