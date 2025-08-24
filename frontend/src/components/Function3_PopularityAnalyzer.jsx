import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, PieChart, Activity, Calendar, Filter } from 'lucide-react'

export default function Function3_PopularityAnalyzer({ popularityGenre, setPopularityGenre, yearRange, setYearRange, loading, handlePopularityAnalysis, popularityResults }) {
  return (
    <div className="function-section">
      <div className="section-header">
        <h2>📊 Popularity Analyzer (Web Analytics Concept)</h2>
        <p>Analyze book popularity using Bayesian scoring and trend analysis</p>
      </div>
      
      <div className="function-grid">
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#10B981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <h3>Trend Analysis</h3>
            <p>Year-over-year popularity trends and patterns</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#F59E0B' }}>
            <PieChart size={24} />
          </div>
          <div className="card-content">
            <h3>Genre Insights</h3>
            <p>Popularity analysis by genre and category</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#8B5CF6' }}>
            <BarChart3 size={24} />
          </div>
          <div className="card-content">
            <h3>Bayesian Scoring</h3>
            <p>Advanced popularity algorithms with confidence intervals</p>
          </div>
        </motion.div>
      </div>

      <div className="popularity-section">
        <h3>Analyze Popularity</h3>
        <div className="filters">
          <div className="filter-group">
            <label>
              <Filter size={16} />
              Genre Filter:
            </label>
            <select 
              value={popularityGenre} 
              onChange={e => setPopularityGenre(e.target.value)}
              className="select-input"
            >
              <option value="">All Genres</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Nonfiction">Nonfiction</option>
              <option value="Historical">Historical</option>
              <option value="Young Adult">Young Adult</option>
              <option value="Horror">Horror</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>
              <Calendar size={16} />
              Year Range:
            </label>
            <div className="year-range">
              <input
                type="number"
                value={yearRange[0]}
                onChange={e => setYearRange([parseInt(e.target.value), yearRange[1]])}
                className="year-input"
                min="1800"
                max="2024"
              />
              <span>to</span>
              <input
                type="number"
                value={yearRange[1]}
                onChange={e => setYearRange([yearRange[0], parseInt(e.target.value)])}
                className="year-input"
                min="1800"
                max="2024"
              />
            </div>
          </div>
        </div>
        
        <motion.button 
          onClick={handlePopularityAnalysis}
          disabled={loading}
          className="primary-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Activity size={20} />
            </motion.div>
          ) : (
            <>
              <TrendingUp size={20} />
              Analyze Popularity
            </>
          )}
        </motion.button>
        
        {popularityResults && (
          <motion.div 
            className="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4>Popularity Analysis Results</h4>
            <div className="popularity-stats">
              <div className="stat-row">
                <motion.div 
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="stat-label">Total Books Analyzed:</span>
                  <span className="stat-value">{popularityResults.popularity_analysis.total_books}</span>
                </motion.div>
                <motion.div 
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="stat-label">Average Rating:</span>
                  <span className="stat-value">{popularityResults.popularity_analysis.average_rating?.toFixed(2)}</span>
                </motion.div>
                <motion.div 
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="stat-label">Average Popularity Score:</span>
                  <span className="stat-value">{popularityResults.popularity_analysis.average_popularity_score?.toFixed(3)}</span>
                </motion.div>
              </div>
              
              <div className="popularity-distribution">
                <h5>Popularity Distribution</h5>
                <div className="distribution-bars">
                  <motion.div 
                    className="dist-bar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span>High</span>
                    <motion.div 
                      className="bar high"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      {popularityResults.popularity_analysis.popularity_distribution.high_popularity}
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    className="dist-bar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span>Medium</span>
                    <motion.div 
                      className="bar medium"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      {popularityResults.popularity_analysis.popularity_distribution.medium_popularity}
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    className="dist-bar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span>Low</span>
                    <motion.div 
                      className="bar low"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      {popularityResults.popularity_analysis.popularity_distribution.low_popularity}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
