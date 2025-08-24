import { useState } from 'react'

export default function Function1_DataPreprocessing({ file, setFile, loading, handleFileUpload, preprocessingStats, sampleBooks }) {
  return (
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
  )
}
