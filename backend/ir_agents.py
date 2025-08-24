from typing import List, Tuple, Dict
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils import flatten_text, normalize

BOOKS: List[Dict] = []
VEC = None
DOC_MATRIX = None

def popularity_score(avg_rating: float, ratings_count: int) -> float:
    r = np.clip(avg_rating, 0, 5) / 5.0
    c = ratings_count
    m = 150
    R = (c/(c+m))*r + (m/(c+m))*0.6
    return float(R)

def load_books(df: pd.DataFrame):
    global BOOKS, VEC, DOC_MATRIX
    records = []
    for _, row in df.iterrows():
        genres = [g.strip() for g in str(row["genres"]).split(";") if g.strip()]
        rec = dict(
            id=str(row["id"]), title=str(row["title"]), summary=str(row["summary"]),
            genres=genres, year=int(row["year"]),
            avg_rating=float(row["avg_rating"]), ratings_count=int(row["ratings_count"])
        )
        rec["pop_score"] = popularity_score(rec["avg_rating"], rec["ratings_count"])
        records.append(rec)
    BOOKS = records
    corpus = [flatten_text(b["title"], b["summary"], b["genres"]) for b in BOOKS]
    VEC = TfidfVectorizer(max_features=20000, ngram_range=(1,2))
    DOC_MATRIX = VEC.fit_transform(corpus)

def classify_genres(text: str, top_k=3) -> List[Tuple[str, float]]:
    CANDIDATES = {
        "Fantasy": ["magic","dragon","kingdom","quest","sword","prophecy","witch","wizard"],
        "Science Fiction": ["space","star","planet","future","ai","robot","alien","galaxy","ship"],
        "Mystery": ["murder","detective","clue","investigation","crime","case","secret"],
        "Romance": ["love","romance","relationship","heart","kiss","wedding","couple"],
        "Thriller": ["chase","conspiracy","danger","threat","spy","heist","mission","race"],
        "Nonfiction": ["guide","history","science","biography","memoir","how","research"],
        "Historical": ["empire","war","century","king","queen","colonial","ancient"],
        "Young Adult": ["school","teen","coming","age","friendship","young"],
        "Horror": ["ghost","haunted","darkness","monster","curse","blood","fear","nightmare"],
        "Self-Help": ["habit","mindset","improve","productivity","goal","success","anxiety"]
    }
    text_n = normalize(text)
    scores = []
    for g, kws in CANDIDATES.items():
        s = sum(text_n.count(k) for k in kws)
        scores.append((g, float(s)))
    scores.sort(key=lambda x: x[1], reverse=True)
    maxs = scores[0][1] if scores else 1.0
    scores = [(g, (s/maxs if maxs>0 else 0.0)) for g,s in scores]
    return scores[:top_k]

def recommend_by_query(query: str, top_k=8) -> List[Dict]:
    global VEC, DOC_MATRIX, BOOKS
    if VEC is None or DOC_MATRIX is None or not BOOKS:
        return []
    q_vec = VEC.transform([normalize(query)])
    sim = cosine_similarity(q_vec, DOC_MATRIX)[0]
    pop = np.array([b["pop_score"] for b in BOOKS])
    blend = 0.7*sim + 0.3*pop
    idx = np.argsort(-blend)[:top_k]
    out = []
    for i in idx:
        b = BOOKS[i]
        out.append({
            "id": b["id"], "title": b["title"], "genres": b["genres"], "year": b["year"],
            "score": float(blend[i]),
            "why": {"similarity": float(sim[i]), "popularity": float(pop[i]),
                     "genre": classify_match_score(query, b["genres"])}
        })
    return out

def classify_match_score(query: str, book_genres: List[str]) -> float:
    preds = [g for g,_ in classify_genres(query, top_k=3)]
    return float(len(set(preds) & set(book_genres))) / max(1, len(set(book_genres)))
