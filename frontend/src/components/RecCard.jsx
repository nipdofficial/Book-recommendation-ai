export default function RecCard({ item }) {
  const { title, genres, score, why } = item
  return (
    <div style={{background:'#11193A',border:'1px solid #1f2937',borderRadius:16,padding:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}>{title}</h3>
        <span style={{fontSize:12,padding:'4px 8px',borderRadius:12,background:'#4F46E5'}}>Score {score.toFixed(2)}</span>
      </div>
      <div style={{fontSize:12,opacity:0.8,marginTop:6}}>Genres: {genres.join(', ')}</div>
      <div style={{fontSize:12,opacity:0.8,marginTop:6}}>
        Why → sim {why.similarity.toFixed(2)} · pop {why.popularity.toFixed(2)} · genre {why.genre.toFixed(2)}
      </div>
    </div>
  )
}