// src/components/ResultDisplay.jsx
import React from 'react';

const ResultDisplay = ({ score }) => {
  return (
    <div className="result-display">
      <h2>Session Complete!</h2>
      <p>Your final score is: {score}</p>
    </div>
  );
};

export default ResultDisplay;
