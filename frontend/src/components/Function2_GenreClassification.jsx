import { useState } from 'react'

export default function Function2_GenreClassification({ genreText, setGenreText, loading, handleGenreClassification, genreResults }) {
  return (
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
  )
}
