// src/components/SessionTypeSelector.jsx
import React from 'react';

const SessionTypeSelector = ({ onSelectSessionType }) => {
  return (
    <div className="session-type-selector">
      <h2>Choose a Session Type</h2>
      <button onClick={() => onSelectSessionType('timed')}>5 Minutes per Session</button>
      <button onClick={() => onSelectSessionType('questions')}>20 Questions in a Session</button>
    </div>
  );
};

export default SessionTypeSelector;
