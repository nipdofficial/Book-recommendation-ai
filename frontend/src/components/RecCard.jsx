export default function RecCard({ item }) {
  const formatScore = (score) => (score * 100).toFixed(1)
  
  return (
    <div className="rec-card">
      <div className="rec-header">
        <h4 className="rec-title">{item.title}</h4>
        <div className="rec-score">
          Score: {formatScore(item.score)}%
        </div>
      </div>
      
      <div className="rec-details">
        <div className="rec-genres">
          {item.genres.map((genre, idx) => (
            <span key={idx} className="genre-tag">{genre}</span>
          ))}
        </div>
        <div className="rec-year">{item.year}</div>
      </div>
      
      <div className="rec-breakdown">
        <h5>Recommendation Breakdown:</h5>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span className="breakdown-label">Similarity:</span>
            <span className="breakdown-value similarity">
              {formatScore(item.why.similarity)}%
            </span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Popularity:</span>
            <span className="breakdown-value popularity">
              {formatScore(item.why.popularity)}%
            </span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Genre Match:</span>
            <span className="breakdown-value genre-match">
              {formatScore(item.why.genre)}%
            </span>
          </div>
          {item.why.feedback_boost && (
            <div className="breakdown-item">
              <span className="breakdown-label">Feedback Boost:</span>
              <span className="breakdown-value feedback">
                {formatScore(item.why.feedback_boost)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}