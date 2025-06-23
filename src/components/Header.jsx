// src/components/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const Header = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (newLanguage) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    // Reset to language selection
    navigate('/');
  };

  const handleGoBack = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      // Remove the last part of the path
      pathParts.pop();
      navigate(pathParts.join('/') || '/');
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    if (onLanguageChange) {
      onLanguageChange(null);
    }
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="header"
      style={{
        width: '100%',
        padding: '1rem',
        backgroundColor: COLORS.background,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🏠 Home
        </motion.button>

        {location.pathname !== '/' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: COLORS.secondary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ← Back
          </motion.button>
        )}
      </div>

      {language && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: COLORS.text, fontWeight: '600' }}>
            Current Language:
          </span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${COLORS.border}`,
              backgroundColor: 'white',
              color: COLORS.text,
              cursor: 'pointer'
            }}
          >
            <option value="french">🇫🇷 Français</option>
            <option value="norwegian">🇳🇴 Norsk</option>
          </select>
        </div>
      )}
    </motion.header>
  );
};

export default Header;