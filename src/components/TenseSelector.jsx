// src/components/TenseSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Updated color palette to match NorwegianSynonyms.css
const COLORS = {
  primary: '#4ECDC4',
  primaryHover: '#44BDB5',
  secondary: '#FF6B6B',
  secondaryHover: '#E95F5F',
  background: '#F7FFF7',
  text: '#1A535C',
  border: '#4ECDC4'
};

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
      'Fortids kondisjonalis',
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
    <div className="tense-selector" style={{
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: COLORS.background,
      borderRadius: '8px'
    }}>
      <h3 style={{
        marginTop: '0',
        marginBottom: '20px',
        fontSize: '1.2rem',
        color: COLORS.text,
        textAlign: 'center'
      }}>Select Verb Tenses to Practice:</h3>
      
      <div className="tense-options" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {currentTenses.map((tense, index) => (
          <motion.label 
            key={tense} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              backgroundColor: '#E6F7F5',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '10px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: `2px solid ${COLORS.border}`
            }}
            className="tense-option"
          >
            <input
              type="checkbox"
              checked={selectedTenses.includes(tense)}
              onChange={() => handleTenseChange(tense)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ color: COLORS.text, fontWeight: '500' }}>{tense}</span>
          </motion.label>
        ))}
      </div>
    </div>
  );
};

export default TenseSelector;