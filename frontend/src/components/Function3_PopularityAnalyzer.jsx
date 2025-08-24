import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, PieChart, Activity, Calendar, Filter, Target, Zap, Star, Users, BookOpen } from 'lucide-react'

export default function Function3_PopularityAnalyzer({ popularityGenre, setPopularityGenre, yearRange, setYearRange, loading, handlePopularityAnalysis, popularityResults }) {
  return (
    <div className="function-section">
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-icon">
          <TrendingUp size={32} />
        </div>
        <h2>📊 Popularity Analyzer</h2>
        <p>Advanced book popularity analysis using Bayesian scoring and trend analysis</p>
        <div className="header-badges">
          <span className="badge">AI-Powered</span>
          <span className="badge">Real-time</span>
          <span className="badge">Analytics</span>
        </div>
      </motion.div>
      
      <div className="function-grid">
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.03, y: -8 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#10B981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <h3>Trend Analysis</h3>
            <p>Year-over-year popularity trends and patterns</p>
            <div className="card-metric">
              <span className="metric-value">📈</span>
              <span className="metric-label">Trend Detection</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.03, y: -8 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#F59E0B' }}>
            <PieChart size={24} />
          </div>
          <div className="card-content">
            <h3>Genre Insights</h3>
            <p>Popularity analysis by genre and category</p>
            <div className="card-metric">
              <span className="metric-value">🎯</span>
              <span className="metric-label">Genre Analysis</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="function-card"
          whileHover={{ scale: 1.03, y: -8 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="card-icon" style={{ backgroundColor: '#8B5CF6' }}>
            <BarChart3 size={24} />
          </div>
          <div className="card-content">
            <h3>Bayesian Scoring</h3>
            <p>Advanced popularity algorithms with confidence intervals</p>
            <div className="card-metric">
              <span className="metric-value">🧮</span>
              <span className="metric-label">AI Algorithm</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="popularity-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="section-title">
          <div className="title-icon">
            <Target size={24} />
          </div>
          <h3>Analyze Popularity</h3>
          <p>Configure your analysis parameters and discover insights</p>
        </div>
        
        <div className="filters-container">
          <div className="filters-header">
            <Filter size={20} />
            <span>Analysis Filters</span>
          </div>
          
          <div className="filters">
            <motion.div 
              className="filter-group enhanced"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <label>
                <BookOpen size={16} />
                Genre Filter
              </label>
              <select 
                value={popularityGenre} 
                onChange={e => setPopularityGenre(e.target.value)}
                className="select-input enhanced"
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
            </motion.div>
            
            <motion.div 
              className="filter-group enhanced"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <label>
                <Calendar size={16} />
                Year Range
              </label>
              <div className="year-range enhanced">
                <div className="year-input-group">
                  <span className="year-label">From</span>
                  <input
                    type="number"
                    value={yearRange[0]}
                    onChange={e => setYearRange([parseInt(e.target.value), yearRange[1]])}
                    className="year-input enhanced"
                    min="1800"
                    max="2024"
                  />
                </div>
                <div className="year-separator">→</div>
                <div className="year-input-group">
                  <span className="year-label">To</span>
                  <input
                    type="number"
                    value={yearRange[1]}
                    onChange={e => setYearRange([yearRange[0], parseInt(e.target.value)])}
                    className="year-input enhanced"
                    min="1800"
                    max="2024"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.button 
          onClick={handlePopularityAnalysis}
          disabled={loading}
          className="primary-button enhanced"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="loading-spinner"
            >
              <Activity size={20} />
            </motion.div>
          ) : (
            <>
              <Zap size={20} />
              <span>Analyze Popularity</span>
            </>
          )}
        </motion.button>
        
        {popularityResults && (
          <motion.div 
            className="results-section enhanced"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 200 }}
          >
            <div className="results-header">
              <div className="results-icon">
                <Star size={24} />
              </div>
              <h4>Popularity Analysis Results</h4>
              <p>Comprehensive insights from your analysis</p>
            </div>
            
            <div className="popularity-stats enhanced">
              <div className="stats-overview">
                <motion.div 
                  className="stat-card enhanced"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="stat-icon">
                    <BookOpen size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{popularityResults.popularity_analysis.total_books}</span>
                    <span className="stat-label">Total Books Analyzed</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="stat-card enhanced"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="stat-icon">
                    <Star size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{popularityResults.popularity_analysis.average_rating?.toFixed(2)}</span>
                    <span className="stat-label">Average Rating</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="stat-card enhanced"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="stat-icon">
                    <TrendingUp size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{popularityResults.popularity_analysis.average_popularity_score?.toFixed(3)}</span>
                    <span className="stat-label">Popularity Score</span>
                  </div>
                </motion.div>
              </div>
              
              <div className="popularity-distribution enhanced">
                <div className="distribution-header">
                  <Users size={20} />
                  <h5>Popularity Distribution</h5>
                </div>
                <div className="distribution-bars enhanced">
                  <motion.div 
                    className="dist-bar enhanced"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="bar-label">
                      <span className="bar-title">High</span>
                      <span className="bar-count">{popularityResults.popularity_analysis.popularity_distribution.high_popularity}</span>
                    </div>
                    <motion.div 
                      className="bar high enhanced"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.6, duration: 1, type: 'spring' }}
                    >
                      <span className="bar-value">{popularityResults.popularity_analysis.popularity_distribution.high_popularity}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="dist-bar enhanced"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <div className="bar-label">
                      <span className="bar-title">Medium</span>
                      <span className="bar-count">{popularityResults.popularity_analysis.popularity_distribution.medium_popularity}</span>
                    </div>
                    <motion.div 
                      className="bar medium enhanced"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.7, duration: 1, type: 'spring' }}
                    >
                      <span className="bar-value">{popularityResults.popularity_analysis.popularity_distribution.medium_popularity}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="dist-bar enhanced"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="bar-label">
                      <span className="bar-title">Low</span>
                      <span className="bar-count">{popularityResults.popularity_analysis.popularity_distribution.low_popularity}</span>
                    </div>
                    <motion.div 
                      className="bar low enhanced"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.8, duration: 1, type: 'spring' }}
                    >
                      <span className="bar-value">{popularityResults.popularity_analysis.popularity_distribution.low_popularity}</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
