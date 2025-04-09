// src/components/TenseSelector.jsx
import React from 'react';

const TenseSelector = ({ language, selectedTenses = [], setSelectedTenses }) => {
  const tenses = {
    french: [
      'Present', 
      'Passé composé', 
      'Imparfait', 
      'Subjonctif', 
      'Conditionnel', 
      'Conditionnel passé', 
      'Plus-que-parfait',
      'Random'
    ],
    norwegian: [
      'Present', 
      'Presens Perfektum', 
      'Preteritum', 
      'Preteritum Perfektum', 
      'Futurum', 
      'Konjunktiv', 
      'Fortids kondisjonalis',  // Corrected "Past Conditional"
      'Random'
    ]
  };

  // Ensure language is a string and handle unexpected values
  const languageKey = typeof language === 'string' ? language.toLowerCase() : '';
  
  // Ensure selectedTenses is always an array
  selectedTenses = Array.isArray(selectedTenses) ? selectedTenses : [];

  // Ensure currentTenses is always an array
  const currentTenses = Array.isArray(tenses[languageKey]) ? tenses[languageKey] : [];

  const handleTenseChange = (tense) => {
    if (!setSelectedTenses) return; // Prevent errors if setSelectedTenses is undefined

    if (tense === 'Random') {
      setSelectedTenses(['Random']);
    } else {
      const updatedTenses = selectedTenses.includes(tense)
        ? selectedTenses.filter(t => t !== tense)
        : [...selectedTenses.filter(t => t !== 'Random'), tense];

      setSelectedTenses(updatedTenses.length ? updatedTenses : ['Random']);
    }
  };

  return (
    <div className="tense-selector">
      <h3>Select Verb Tenses to Practice:</h3>
      <div className="tense-options">
        {currentTenses.map((tense) => (
          <label key={tense} className="tense-option">
            <input
              type="checkbox"
              checked={selectedTenses.includes(tense)}
              onChange={() => handleTenseChange(tense)}
            />
            <span>{tense}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TenseSelector;