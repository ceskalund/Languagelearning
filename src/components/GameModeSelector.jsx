// src/components/GameModeSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const GameModeSelector = ({ onSelectMode, language }) => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'verbConjugation',
      name: {
        french: 'Conjugaison des Verbes',
        norwegian: 'Verb Bøying'
      },
      description: {
        french: 'Pratiquez la conjugaison des verbes dans différents temps',
        norwegian: 'Øv på å bøye verb i ulike tider'
      },
      icon: '📝'
    },
    {
      id: 'grammarTest',
      name: {
        french: 'Test de Grammaire',
        norwegian: 'Grammatikk Test'
      },
      description: {
        french: 'Testez vos connaissances des règles grammaticales',
        norwegian: 'Test din kunnskap om grammatikkregler'
      },
      icon: '📚'
    },
    {
      id: 'synonymIdentifier',
      name: {
        french: 'Identificateur de Synonymes',
        norwegian: 'Synonym Identifikator'
      },
      description: {
        french: 'Enrichissez votre vocabulaire en trouvant des synonymes',
        norwegian: 'Utvid ordforrådet ditt ved å finne synonymer'
      },
      icon: '🔤'
    }
  ];

  const handleModeSelect = (modeId) => {
    onSelectMode(modeId);
    navigate('/session-type');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-mode-selector"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        style={{
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2rem'
        }}
      >
        {language === 'french' ? 'Choisissez votre mode de jeu' : 'Velg spillmodus'}
      </motion.h2>

      <div className="modes-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {modes.map((mode, index) => (
          <motion.button
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: COLORS.background,
              border: `2px solid ${COLORS.border}`,
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <span style={{
              fontSize: '2rem',
              backgroundColor: COLORS.primary,
              color: 'white',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}>
              {mode.icon}
            </span>
            <div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: COLORS.text,
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                {mode.name[language]}
              </h3>
              <p style={{
                margin: 0,
                color: COLORS.text,
                opacity: 0.8,
                fontSize: '1rem'
              }}>
                {mode.description[language]}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default GameModeSelector;