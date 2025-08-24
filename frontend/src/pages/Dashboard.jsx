import { useEffect, useState } from 'react'
import api from '../api'
import RecCard from '../components/RecCard'

export default function Dashboard() {
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [activeTab, setActiveTab] = useState('function1')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [preprocessingStats, setPreprocessingStats] = useState(null)
  const [genreResults, setGenreResults] = useState(null)
  const [popularityResults, setPopularityResults] = useState(null)
  const [recommendationResults, setRecommendationResults] = useState(null)
  const [sampleBooks, setSampleBooks] = useState([])

  // Form states
  const [genreText, setGenreText] = useState('')
  const [popularityGenre, setPopularityGenre] = useState('')
  const [yearRange, setYearRange] = useState([1900, 2024])
  const [query, setQuery] = useState('')
  const [feedbackBookId, setFeedbackBookId] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => { 
    api.get('/').then(r => setStatus(r.data))
    api.get('/books?limit=6').then(r => setSampleBooks(r.data.items))
  }, [])

  const handleFileUpload = async (endpoint) => {
    if (!file) return alert('Please select a CSV file first.')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post(endpoint, form, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      })
      
      if (endpoint === '/function1/preprocess') {
        setPreprocessingStats(data.preprocessing_stats)
        setMessage(`✅ ${data.message}`)
        // Refresh sample books
        const l = await api.get('/books?limit=6')
        setSampleBooks(l.data.items)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGenreClassification = async () => {
    if (!genreText.trim()) return alert('Please enter text to classify.')
    setLoading(true)
    try {
      const { data } = await api.post('/function2/classify-genres', {
        text: genreText,
        top_k: 5
      })
      setGenreResults(data)
      setMessage('✅ Genre classification completed!')
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePopularityAnalysis = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/function3/analyze-popularity', {
        genre: popularityGenre || undefined,
        year_range: yearRange
      })
      setPopularityResults(data)
      setMessage('✅ Popularity analysis completed!')
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEnhancedRecommendation = async () => {
    if (!query.trim()) return alert('Please enter a query.')
    setLoading(true)
    try {
      const { data } = await api.post('/function4/enhanced-recommendation', {
        query: query,
        top_k: 8
      })
      setRecommendationResults(data)
      setMessage('✅ Enhanced recommendations generated!')
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async () => {
    if (!feedbackBookId || !feedbackRating) return alert('Please fill in all fields.')
    try {
      await api.post('/feedback', {
        book_id: feedbackBookId,
        rating: feedbackRating,
        feedback_text: feedbackText,
        user_id: 'user_' + Date.now()
      })
      setMessage('✅ Feedback submitted successfully!')
      setFeedbackBookId('')
      setFeedbackRating(5)
      setFeedbackText('')
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.detail || error.message}`)
    }
  }

  const TabButton = ({ id, title, description }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  )

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>📚 BookRec - Agentic AI System</h1>
          <p className="subtitle">Information Retrieval & Web Analytics Project</p>
          <div className="status-badge">
            API Status: {status ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
      </header>

      {/* Message Display */}
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <TabButton 
          id="function1" 
          title="1. Data Collection & Preprocessing" 
          description="IR Concept - Data ingestion, cleaning, and preprocessing"
        />
        <TabButton 
          id="function2" 
          title="2. Genre Classification" 
          description="IR & NLP Concept - ML-based genre classification"
        />
        <TabButton 
          id="function3" 
          title="3. Popularity Analyzer" 
          description="Web Analytics Concept - Popularity scoring and trends"
        />
        <TabButton 
          id="function4" 
          title="4. Suggestion Agent" 
          description="Hybrid IR + Web Analytics - Enhanced recommendations"
        />
      </nav>

      {/* Tab Content */}
      <main className="tab-content">
        {/* Function 1: Data Collection & Preprocessing */}
        {activeTab === 'function1' && (
          <div className="function-section">
            <div className="section-header">
              <h2>🔍 Data Collection & Preprocessing (IR Concept)</h2>
              <p>First step in information retrieval - collect, clean, and structure book data</p>
            </div>
            
            <div className="upload-section">
              <h3>Upload Dataset</h3>
              <div className="file-input-group">
                <input 
                  type='file' 
                  accept='.csv' 
                  onChange={e => setFile(e.target.files[0])}
                  className="file-input"
                />
                <button 
                  onClick={() => handleFileUpload('/function1/preprocess')}
                  disabled={loading || !file}
                  className="primary-button"
                >
                  {loading ? 'Processing...' : 'Process & Load Data'}
                </button>
              </div>
              
              {preprocessingStats && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Data Processing Stats</h4>
                    <div className="stat-item">
                      <span>Duplicates Removed:</span>
                      <span className="stat-value">{preprocessingStats.duplicates_removed}</span>
                    </div>
                    <div className="stat-item">
                      <span>Data Cleaned:</span>
                      <span className="stat-value">{preprocessingStats.data_cleaned ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="stat-item">
                      <span>Genres Standardized:</span>
                      <span className="stat-value">{preprocessingStats.genres_standardized ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sample-data">
              <h3>Sample Processed Data</h3>
              <div className="books-grid">
                {sampleBooks.map(book => (
                  <div key={book.id} className="book-card">
                    <h4>{book.title}</h4>
                    <p className="book-genres">{book.genres.join(', ')}</p>
                    <p className="book-year">{book.year}</p>
                    <div className="book-rating">
                      ⭐ {book.avg_rating} ({book.ratings_count.toLocaleString()})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Function 2: Genre Classification */}
        {activeTab === 'function2' && (
          <div className="function-section">
            <div className="section-header">
              <h2>🏷️ Genre Classification (IR & NLP Concept)</h2>
              <p>Document classification using TF-IDF, ML, and rule-based approaches</p>
            </div>
            
            <div className="classification-section">
              <h3>Classify Text</h3>
              <div className="input-group">
                <textarea
                  value={genreText}
                  onChange={e => setGenreText(e.target.value)}
                  placeholder="Enter book title, summary, or description to classify..."
                  className="text-input"
                  rows={4}
                />
                <button 
                  onClick={handleGenreClassification}
                  disabled={loading || !genreText.trim()}
                  className="primary-button"
                >
                  {loading ? 'Classifying...' : 'Classify Genres'}
                </button>
              </div>
              
              {genreResults && (
                <div className="results-section">
                  <h4>Classification Results</h4>
                  <div className="genre-results">
                    <div className="primary-genre">
                      <span className="label">Primary Genre:</span>
                      <span className="genre-badge primary">{genreResults.primary_genre}</span>
                    </div>
                    <div className="all-genres">
                      <span className="label">All Genres:</span>
                      <div className="genre-list">
                        {genreResults.classified_genres.map(([genre, score], idx) => (
                          <div key={idx} className="genre-item">
                            <span className="genre-name">{genre}</span>
                            <span className="confidence-score">{(score * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="nlp-techniques">
                      <span className="label">NLP Techniques Used:</span>
                      <div className="technique-tags">
                        {genreResults.nlp_techniques_used.map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Function 3: Popularity Analyzer */}
        {activeTab === 'function3' && (
          <div className="function-section">
            <div className="section-header">
              <h2>📊 Popularity Analyzer (Web Analytics Concept)</h2>
              <p>Analyze book popularity using Bayesian scoring and trend analysis</p>
            </div>
            
            <div className="popularity-section">
              <h3>Analyze Popularity</h3>
              <div className="filters">
                <div className="filter-group">
                  <label>Genre Filter:</label>
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
                  <label>Year Range:</label>
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
              
              <button 
                onClick={handlePopularityAnalysis}
                disabled={loading}
                className="primary-button"
              >
                {loading ? 'Analyzing...' : 'Analyze Popularity'}
              </button>
              
              {popularityResults && (
                <div className="results-section">
                  <h4>Popularity Analysis Results</h4>
                  <div className="popularity-stats">
                    <div className="stat-row">
                      <div className="stat-item">
                        <span className="stat-label">Total Books Analyzed:</span>
                        <span className="stat-value">{popularityResults.popularity_analysis.total_books}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Average Rating:</span>
                        <span className="stat-value">{popularityResults.popularity_analysis.average_rating?.toFixed(2)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Average Popularity Score:</span>
                        <span className="stat-value">{popularityResults.popularity_analysis.average_popularity_score?.toFixed(3)}</span>
                      </div>
                    </div>
                    
                    <div className="popularity-distribution">
                      <h5>Popularity Distribution</h5>
                      <div className="distribution-bars">
                        <div className="dist-bar">
                          <span>High</span>
                          <div className="bar high">{popularityResults.popularity_analysis.popularity_distribution.high_popularity}</div>
                        </div>
                        <div className="dist-bar">
                          <span>Medium</span>
                          <div className="bar medium">{popularityResults.popularity_analysis.popularity_distribution.medium_popularity}</div>
                        </div>
                        <div className="dist-bar">
                          <span>Low</span>
                          <div className="bar low">{popularityResults.popularity_analysis.popularity_distribution.low_popularity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Function 4: Suggestion Agent */}
        {activeTab === 'function4' && (
          <div className="function-section">
            <div className="section-header">
              <h2>🤖 Suggestion Agent (Hybrid IR + Web Analytics)</h2>
              <p>Combines content-based filtering, popularity, and user feedback</p>
            </div>
            
            <div className="recommendation-section">
              <h3>Get Recommendations</h3>
              <div className="input-group">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g., fast-paced sci-fi with found family themes"
                  className="text-input"
                />
                <button 
                  onClick={handleEnhancedRecommendation}
                  disabled={loading || !query.trim()}
                  className="primary-button"
                >
                  {loading ? 'Generating...' : 'Get Recommendations'}
                </button>
              </div>
              
              {recommendationResults && (
                <div className="results-section">
                  <h4>Enhanced Recommendations</h4>
                  <div className="algorithm-info">
                    <p><strong>Algorithm:</strong> {recommendationResults.recommendation_algorithm}</p>
                    <p><strong>IR Techniques:</strong> {recommendationResults.ir_techniques.join(', ')}</p>
                  </div>
                  
                  <div className="recommendations-grid">
                    {recommendationResults.recommendations.map((rec, idx) => (
                      <RecCard key={idx} item={rec} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="feedback-section">
              <h3>User Feedback System</h3>
              <div className="feedback-form">
                <div className="form-row">
                  <input
                    value={feedbackBookId}
                    onChange={e => setFeedbackBookId(e.target.value)}
                    placeholder="Book ID"
                    className="text-input"
                  />
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
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Optional feedback text..."
                  className="text-input"
                  rows={2}
                />
                <button onClick={submitFeedback} className="secondary-button">
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}