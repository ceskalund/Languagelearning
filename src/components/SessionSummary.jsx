// src/components/SessionSummary.jsx
import React, { useState } from 'react';

const SessionSummary = ({ 
  stats, 
  score, 
  maxQuestions, 
  sessionType, 
  language, 
  onRestart, 
  onChangeSettings 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate performance metrics
  const totalQuestions = stats.correct.length + stats.incorrect.length;
  const accuracyPercentage = totalQuestions > 0 
    ? Math.round((stats.correct.length / totalQuestions) * 100) 
    : 0;

  // Group incorrect verbs by their frequency
  const verbPerformance = {};
  stats.incorrect.forEach(question => {
    const verb = question.verb;
    if (!verbPerformance[verb]) {
      verbPerformance[verb] = {
        count: 1,
        instances: [question]
      };
    } else {
      verbPerformance[verb].count++;
      verbPerformance[verb].instances.push(question);
    }
  });

  // Sort verbs by difficulty (most problematic first)
  const problematicVerbs = Object.entries(verbPerformance)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5); // Top 5 most challenging verbs

  // Render different tabs
  const renderOverview = () => (
    <div className="session-overview">
      <div className="summary-stats">
        <h3>Session Summary</h3>
        <p><strong>Total Questions:</strong> {totalQuestions}</p>
        <p><strong>Correct Answers:</strong> {stats.correct.length}</p>
        <p><strong>Incorrect Answers:</strong> {stats.incorrect.length}</p>
        <p><strong>Accuracy:</strong> {accuracyPercentage}%</p>
      </div>
    </div>
  );

  const renderProblemVerbs = () => (
    <div className="problematic-verbs">
      <h3>Verbs to Review</h3>
      {problematicVerbs.length === 0 ? (
        <p>Great job! No specific verbs to review.</p>
      ) : (
        <table className="verb-performance-table">
          <thead>
            <tr>
              <th>Verb</th>
              <th>Mistakes</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {problematicVerbs.map(([verb, data]) => (
              <tr key={verb}>
                <td>{verb}</td>
                <td>{data.count}</td>
                <td>
                  <details>
                    <summary>View Mistakes</summary>
                    <ul>
                      {data.instances.map((instance, index) => (
                        <li key={index}>
                          <p>Tense: {instance.tense}</p>
                          <p>Pronoun: {instance.pronoun}</p>
                          <p>Correct Answer: {instance.correctAnswer}</p>
                          <p>Your Answer: {instance.userAnswer}</p>
                        </li>
                      ))}
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderTensePerformance = () => {
    // Calculate performance by tense
    const tensePerformance = Object.entries(stats.tenseStats)
      .map(([tense, data]) => ({
        tense,
        total: data.total,
        correct: data.correct,
        accuracy: Math.round((data.correct / data.total) * 100)
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return (
      <div className="tense-performance">
        <h3>Tense Performance</h3>
        <table className="tense-performance-table">
          <thead>
            <tr>
              <th>Tense</th>
              <th>Total Questions</th>
              <th>Correct Answers</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {tensePerformance.map(tense => (
              <tr key={tense.tense}>
                <td>{tense.tense}</td>
                <td>{tense.total}</td>
                <td>{tense.correct}</td>
                <td>{tense.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="session-summary-container">
      <h2>Session Complete</h2>
      <p>Your final score: {score} out of {maxQuestions}</p>
      
      <div className="summary-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'problemVerbs' ? 'active' : ''}
          onClick={() => setActiveTab('problemVerbs')}
        >
          Verbs to Review
        </button>
        <button 
          className={activeTab === 'tensePerformance' ? 'active' : ''}
          onClick={() => setActiveTab('tensePerformance')}
        >
          Tense Performance
        </button>
      </div>

      <div className="summary-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'problemVerbs' && renderProblemVerbs()}
        {activeTab === 'tensePerformance' && renderTensePerformance()}
      </div>

      <div className="summary-actions">
        <button onClick={onRestart}>Practice Again</button>
        <button onClick={onChangeSettings}>Change Settings</button>
      </div>
    </div>
  );
};

export default SessionSummary;