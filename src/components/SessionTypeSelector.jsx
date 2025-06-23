// src/components/SessionTypeSelector.jsx
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

const SessionTypeSelector = ({ onSelectType, language, gameMode }) => {
  const navigate = useNavigate();

  const sessionTypes = [
    {
      id: 'timed',
      name: {
        french: 'Session Chronométrée',
        norwegian: 'Tidsbegrenset Økt'
      },
      description: {
        french: 'Défi de 5 minutes pour tester vos compétences',
        norwegian: '5-minutters utfordring for å teste ferdighetene dine'
      },
      icon: '⏱️'
    },
    {
      id: 'questions',
      name: {
        french: 'Série de Questions',
        norwegian: 'Spørsmålssett'
      },
      description: {
        french: '20 questions à votre rythme',
        norwegian: '20 spørsmål i ditt eget tempo'
      },
      icon: '📋'
    }
  ];

  // Get appropriate game mode title
  const gameModeTitle = (() => {
    switch(gameMode) {
      case 'verbConjugation':
        return {
          french: 'Conjugaison des Verbes',
          norwegian: 'Verb Bøying'
        };
      case 'synonymIdentifier':
        return {
          french: 'Identificateur de Synonymes',
          norwegian: 'Synonym Identifikator'
        };
      case 'grammarTest':
        return {
          french: 'Test de Grammaire',
          norwegian: 'Grammatikk Test'
        };
      default:
        return {
          french: 'Pratique de Langue',
          norwegian: 'Språkøvelse'
        };
    }
  })();

  const handleTypeSelect = (typeId) => {
    onSelectType(typeId);
    navigate('/game');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="session-type-selector"
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
          marginBottom: '1rem',
          fontSize: '2rem'
        }}
      >
        {gameModeTitle[language]}
      </motion.h2>

      <motion.h3
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        style={{
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.5rem',
          opacity: 0.8
        }}
      >
        {language === 'french' ? 'Choisissez votre type de session' : 'Velg øktstype'}
      </motion.h3>

      <div className="session-types-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sessionTypes.map((type, index) => (
          <motion.button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
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
              {type.icon}
            </span>
            <div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: COLORS.text,
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                {type.name[language]}
              </h3>
              <p style={{
                margin: 0,
                color: COLORS.text,
                opacity: 0.8,
                fontSize: '1rem'
              }}>
                {type.description[language]}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionTypeSelector;