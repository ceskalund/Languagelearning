import React from 'react';
import { motion } from 'framer-motion';

// Shared color palette for consistency
const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',  // Unified background color
  background: '#F7FFF7',
  text: '#1A535C',
  accent: '#FFE66D',
};

const MinimalMascot = () => (
  <div className="flex justify-center">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100"
      width="48"  // Fixed width
      height="48" // Fixed height
      className="mx-auto"
    >
      {/* Add mascot SVG content here */}
    </svg>
  </div>
);

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
    <div 
      className="relative flex flex-col items-center justify-center w-full min-h-screen p-6"
      style={{ backgroundColor: COLORS.secondary }} // Unified background
    >
      {/* Centered Minimal Mascot (Fixed Size) */}
      <MinimalMascot />

      <motion.h1 
        className="text-3xl font-bold mb-4 text-center"
        style={{ color: COLORS.primary }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Choisissez Votre Langue
      </motion.h1>
      
      <p className="text-lg mb-6 text-center" style={{ color: COLORS.background }}>
        Sélectionnez une langue pour commencer
      </p>
      
      <div className="space-y-4 w-full max-w-xs">
        {languages.map((language, index) => (
          <motion.button
            key={language.code}
            onClick={() => onSelectLanguage(language.code)}
            className="
              w-full 
              p-4 
              rounded-lg 
              shadow-md 
              flex 
              items-center 
              justify-start 
              space-x-4
              hover:bg-opacity-90
              transition-all duration-300
            "
            style={{ 
              backgroundColor: COLORS.primary,
              color: COLORS.background
            }}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 300 }}
          >
            <span className="text-3xl">{language.flag}</span>
            <div className="text-left">
              <h2 className="text-xl font-bold">{language.name}</h2>
              <p className="text-sm opacity-75">{language.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
