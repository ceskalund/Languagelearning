import React from 'react';

// Shared color palette for consistency
const COLORS = {
  primary: '#FF6B6B',     
  secondary: '#4ECDC4',   
  background: '#F7FFF7',  
  text: '#1A535C',        
  accent: '#FFE66D',      
};

const Header = () => {
  return (
    <header 
      className="py-5 flex flex-col items-center text-center w-full shadow-md"
      style={{ backgroundColor: COLORS.secondary, color: COLORS.background }}
    >
      <h1 className="text-3xl font-bold">
        Verb Voyage
      </h1>
      <span className="text-sm opacity-80">
        Language Learning Adventure
      </span>
    </header>
  );
};

export default Header;
