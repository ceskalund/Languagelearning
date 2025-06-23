// src/components/LanguageSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Updated color palette to match NorwegianSynonyms.css
const COLORS = {
  primary: '#4ECDC4',
  primaryHover: '#44BDB5',
  secondary: '#FF6B6B',
  secondaryHover: '#E95F5F',
  background: '#F7FFF7',
  foreground: 'white',
  text: '#1A535C',
  border: '#4ECDC4'
};

const LanguageSelector = ({ onSelectLanguage }) => {
  const languages = [
    { 
      code: 'french', 
      name: 'Français', 
      flag: '🇫🇷', 
      description: 'Commençons l\'aventure linguistique !' 
    },
    { 
      code: 'norwegian', 
      name: 'Norsk', 
      flag: '🇳🇴', 
      description: 'La språklig utforskning begynne!' 
    }
  ];

  return (
    <div className="language-selector-container" style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <motion.div 
        className="language-selection"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}
      >
        <motion.h2 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{
            color: COLORS.text,
            marginBottom: '20px',
            fontSize: '2rem'
          }}
        >
          Choose Your Language
        </motion.h2>
        
        <div className="instructions" style={{
          backgroundColor: COLORS.background,
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <p style={{ margin: '10px 0', color: COLORS.text, lineHeight: '1.5' }}>
            Select a language to begin your learning journey!
          </p>
          <p style={{ margin: '10px 0', color: COLORS.text, lineHeight: '1.5' }}>
            Each language features unique vocabulary and grammar exercises.
          </p>
        </div>
        
        <div className="language-options-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {languages.map((language, index) => (
            <motion.button
              key={language.code}
              onClick={() => onSelectLanguage(language.code)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: COLORS.background,
                border: `2px solid ${COLORS.border}`,
                borderRadius: '8px',
                padding: '15px 20px',
                fontSize: '1.1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                color: COLORS.text,
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ 
                fontSize: '2rem', 
                marginRight: '15px',
                backgroundColor: index === 0 ? COLORS.primary : COLORS.secondary,
                color: 'white',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}>{language.flag}</span>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontWeight: '600' }}>{language.name}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: '0.8' }}>{language.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: COLORS.primary,
            color: 'white',
            fontSize: '1.1rem',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            marginTop: '30px'
          }}
          onClick={() => window.location.reload()}
        >
          View All Options
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;