import { useEffect, useState } from 'react'
import api from '../api'
import RecCard from '../components/RecCard'

export default function Dashboard() {
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [q, setQ] = useState('')
  const [recs, setRecs] = useState([])
  const [sampleBooks, setSampleBooks] = useState([])

  useEffect(() => { api.get('/').then(r => setStatus(r.data)) }, [])

  const ingest = async () => {
    if (!file) return alert('Pick a CSV first.')
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post('/ingest/csv', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    alert(`Ingested ${data.count} books`)
    const l = await api.get('/books?limit=6')
    setSampleBooks(l.data.items)
  }

  const recommend = async () => {
    const { data } = await api.post('/recommend', { query: q, top_k: 8 })
    setRecs(data.results)
  }

  return (
    <div style={{maxWidth:960, margin:'0 auto', padding:24}}>
      <h1>BookRec – IRWA Demo Dashboard</h1>
      <div style={{opacity:0.8, marginBottom:16}}>API status: {status ? 'OK' : 'loading...'}</div>

      <section style={{marginTop:24}}>
        <h2>1) Load Dataset (CSV)</h2>
        <input type='file' accept='.csv' onChange={e=>setFile(e.target.files[0])}/>
        <button onClick={ingest} style={{marginLeft:8}}>Ingest</button>
        <div style={{marginTop:12, display:'grid', gap:8}}>
          {sampleBooks.map(b => (
            <div key={b.id} style={{background:'#0B1023', padding:12, borderRadius:12, border:'1px solid #1f2937'}}>
              <b>{b.title}</b> · {b.genres.join(', ')} · ⭐{b.avg_rating} ({b.ratings_count})
            </div>
          ))}
        </div>
      </section>

      <section style={{marginTop:24}}>
        <h2>2+4) Suggestion Agent (Content + Popularity)</h2>
        <div>
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder='e.g., fast-paced sci-fi with found family'
            style={{width:'70%', padding:10, borderRadius:8, border:'1px solid #1f2937', background:'#0B1023', color:'#E5E7EB'}}
          />
          <button onClick={recommend} style={{marginLeft:8}}>Recommend</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          {recs.map((r,i) => <RecCard key={i} item={r} />)}
        </div>
      </section>
    </div>
  )
}