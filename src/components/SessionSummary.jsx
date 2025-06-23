// src/components/SessionSummary.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
      
      {accuracyPercentage === 100 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="perfect-score"
        >
          <p>🏆 Perfect score! You're mastering this language!</p>
        </motion.div>
      )}
      
      {accuracyPercentage >= 80 && accuracyPercentage < 100 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="congrats-message"
        >
          <p>🌟 Great job! Keep practicing to reach perfection!</p>
        </motion.div>
      )}
    </div>
  );

  const renderProblemVerbs = () => (
    <div className="problematic-verbs">
      <h3>Verbs to Review</h3>
      {problematicVerbs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="congrats-message"
        >
          <p>Great job! No specific verbs to review.</p>
        </motion.div>
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
            {problematicVerbs.map(([verb, data], index) => (
              <motion.tr 
                key={verb}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td>{verb}</td>
                <td>{data.count}</td>
                <td>
                  <details>
                    <summary className="details-summary">View Mistakes</summary>
                    <ul className="mistakes-list">
                      {data.instances.map((instance, idx) => (
                        <li key={idx} className="mistake-item">
                          <p><strong>Tense:</strong> {instance.tense}</p>
                          <p><strong>Pronoun:</strong> {instance.pronoun}</p>
                          <p><strong>Correct Answer:</strong> <span className="correct-answer">{instance.correctAnswer}</span></p>
                          <p><strong>Your Answer:</strong> <span className="user-answer">{instance.userAnswer}</span></p>
                        </li>
                      ))}
                    </ul>
                  </details>
                </td>
              </motion.tr>
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
            {tensePerformance.map((tense, index) => (
              <motion.tr 
                key={tense.tense}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td>{tense.tense}</td>
                <td>{tense.total}</td>
                <td>{tense.correct}</td>
                <td>{tense.accuracy}%</td>
              </motion.tr>
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
        <motion.button 
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Practice Again
        </motion.button>
        <motion.button 
          onClick={onChangeSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Change Settings
        </motion.button>
      </div>
    </div>
  );
};

export default SessionSummary;