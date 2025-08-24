import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, Users, RefreshCw, MessageSquare, Star, TrendingUp, Brain } from 'lucide-react'
import RecCard from './RecCard'

export default function Function4_SuggestionAgent({ query, setQuery, loading, handleEnhancedRecommendation, recommendationResults, feedbackBookId, setFeedbackBookId, feedbackRating, setFeedbackRating, feedbackText, setFeedbackText, submitFeedback }) {
  return (
    <div className="function-section">
      <div className="section-header">
        <h2>🤖 Suggestion Agent (Hybrid IR + Web Analytics)</h2>
        <p>Combines content-based filtering, popularity, and user feedback</p>
      </div>
      
      <div className="function-grid">
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#3B82F6' }}>
            <Search size={24} />
          </div>
          <div className="card-content">
            <h3>Content-Based Filtering</h3>
            <p>Recommendations based on book content and features</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#10B981' }}>
            <Users size={24} />
          </div>
          <div className="card-content">
            <h3>Collaborative Filtering</h3>
            <p>User behavior and preference analysis</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#8B5CF6' }}>
            <RefreshCw size={24} />
          </div>
          <div className="card-content">
            <h3>Hybrid Algorithms</h3>
            <p>Combined approaches for optimal recommendations</p>
          </div>
        </motion.div>
      </div>

      <div className="recommendation-section">
        <h3>Get Recommendations</h3>
        <div className="input-group">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g., fast-paced sci-fi with found family themes"
              className="text-input search-input"
            />
          </div>
          <motion.button 
            onClick={handleEnhancedRecommendation}
            disabled={loading || !query.trim()}
            className="primary-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={20} />
              </motion.div>
            ) : (
              <>
                <Sparkles size={20} />
                Get Recommendations
              </>
            )}
          </motion.button>
        </div>
        
        {recommendationResults && (
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4>Enhanced Recommendations</h4>
            <div className="algorithm-info">
              <motion.div 
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Brain size={16} />
                <span><strong>Algorithm:</strong> {recommendationResults.recommendation_algorithm}</span>
              </motion.div>
              <motion.div 
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingUp size={16} />
                <span><strong>IR Techniques:</strong> {recommendationResults.ir_techniques.join(', ')}</span>
              </motion.div>
            </div>
            
            <div className="recommendations-grid">
              {recommendationResults.recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <RecCard item={rec} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="feedback-section">
        <h3>User Feedback System</h3>
        <div className="feedback-form">
          <div className="form-row">
            <div className="input-group">
              <label>
                <MessageSquare size={16} />
                Book ID:
              </label>
              <input
                value={feedbackBookId}
                onChange={e => setFeedbackBookId(e.target.value)}
                placeholder="Enter book ID"
                className="text-input"
              />
            </div>
            <div className="input-group">
              <label>
                <Star size={16} />
                Rating:
              </label>
              <select
                value={feedbackRating}
                onChange={e => setFeedbackRating(parseInt(e.target.value))}
                className="select-input"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>
              <MessageSquare size={16} />
              Feedback:
            </label>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="text-input"
              rows={3}
            />
          </div>
          <motion.button 
            onClick={submitFeedback} 
            className="secondary-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star size={16} />
            Submit Feedback
          </motion.button>
        </div>
      </div>
    </div>
  )
}
