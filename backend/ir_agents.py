from typing import List, Tuple, Dict
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
import re
from collections import Counter
from utils import flatten_text, normalize

BOOKS: List[Dict] = []
VEC = None
DOC_MATRIX = None
GENRE_CLASSIFIER = None
LABEL_ENCODER = None
USER_FEEDBACK = {}

def popularity_score(avg_rating: float, ratings_count: int) -> float:
    r = np.clip(avg_rating, 0, 5) / 5.0
    c = ratings_count
    m = 150
    R = (c/(c+m))*r + (m/(c+m))*0.6
    return float(R)

def preprocess_data(df: pd.DataFrame, clean_data: bool = True, remove_duplicates: bool = True, standardize_genres: bool = True) -> pd.DataFrame:
    """Enhanced data preprocessing for IR pipeline"""
    df_processed = df.copy()
    
    if clean_data:
        # Clean text fields
        df_processed['title'] = df_processed['title'].astype(str).str.strip()
        df_processed['summary'] = df_processed['summary'].astype(str).str.strip()
        
        # Remove rows with missing critical data
        df_processed = df_processed.dropna(subset=['title', 'summary'])
        
        # Clean genres
        df_processed['genres'] = df_processed['genres'].astype(str).str.strip()
    
    if remove_duplicates:
        df_processed = df_processed.drop_duplicates(subset=['title', 'summary'])
    
    if standardize_genres:
        # Standardize genre names
        genre_mapping = {
            'Sci-Fi': 'Science Fiction',
            'SciFi': 'Science Fiction',
            'SFF': 'Science Fiction',
            'Fiction': 'General Fiction',
            'Non-Fiction': 'Nonfiction',
            'Self Help': 'Self-Help',
            'Young Adult': 'Young Adult',
            'YA': 'Young Adult'
        }
        
        def standardize_genre(genre_str):
            genres = [g.strip() for g in str(genre_str).split(';') if g.strip()]
            standardized = []
            for genre in genres:
                standardized.append(genre_mapping.get(genre, genre))
            return ';'.join(standardized)
        
        df_processed['genres'] = df_processed['genres'].apply(standardize_genre)
    
    return df_processed

def load_books(df: pd.DataFrame):
    global BOOKS, VEC, DOC_MATRIX, GENRE_CLASSIFIER, LABEL_ENCODER
    
    # Preprocess data
    df_processed = preprocess_data(df)
    
    records = []
    all_genres = set()
    
    for _, row in df_processed.iterrows():
        genres = [g.strip() for g in str(row["genres"]).split(";") if g.strip()]
        all_genres.update(genres)
        
        rec = dict(
            id=str(row["id"]), title=str(row["title"]), summary=str(row["summary"]),
            genres=genres, year=int(row["year"]),
            avg_rating=float(row["avg_rating"]), ratings_count=int(row["ratings_count"])
        )
        rec["pop_score"] = popularity_score(rec["avg_rating"], rec["ratings_count"])
        records.append(rec)
    
    BOOKS = records
    
    # Build TF-IDF vectors
    corpus = [flatten_text(b["title"], b["summary"], b["genres"]) for b in BOOKS]
    VEC = TfidfVectorizer(max_features=20000, ngram_range=(1,2), stop_words='english')
    DOC_MATRIX = VEC.fit_transform(corpus)
    
    # Train genre classifier
    if len(all_genres) > 1:
        train_genre_classifier(records, all_genres)

def train_genre_classifier(books: List[Dict], all_genres: set):
    """Train a more sophisticated genre classifier using ML"""
    global GENRE_CLASSIFIER, LABEL_ENCODER
    
    # Prepare training data
    texts = [flatten_text(b["title"], b["summary"], b["genres"]) for b in books]
    labels = [b["genres"][0] if b["genres"] else "Unknown" for b in books]  # Use primary genre
    
    # Encode labels
    LABEL_ENCODER = LabelEncoder()
    encoded_labels = LABEL_ENCODER.fit_transform(labels)
    
    # Create and train classifier
    GENRE_CLASSIFIER = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=10000, ngram_range=(1,2), stop_words='english')),
        ('classifier', MultinomialNB())
    ])
    
    GENRE_CLASSIFIER.fit(texts, encoded_labels)

def classify_genres(text: str, top_k=3) -> List[Tuple[str, float]]:
    """Enhanced genre classification using both ML and rule-based approaches"""
    if GENRE_CLASSIFIER is not None and LABEL_ENCODER is not None:
        # Try ML-based classification first
        try:
            text_processed = flatten_text(text, "", "")
            prediction = GENRE_CLASSIFIER.predict([text_processed])[0]
            confidence = np.max(GENRE_CLASSIFIER.predict_proba([text_processed]))
            predicted_genre = LABEL_ENCODER.inverse_transform([prediction])[0]
            
            if confidence > 0.3:  # Only use ML if confident
                return [(predicted_genre, float(confidence))]
        except:
            pass
    
    # Fallback to rule-based classification
    CANDIDATES = {
        "Fantasy": ["magic","dragon","kingdom","quest","sword","prophecy","witch","wizard","elf","dwarf","orc","spell","enchanted"],
        "Science Fiction": ["space","star","planet","future","ai","robot","alien","galaxy","ship","technology","cyber","dystopian","time travel"],
        "Mystery": ["murder","detective","clue","investigation","crime","case","secret","mystery","suspense","whodunit"],
        "Romance": ["love","romance","relationship","heart","kiss","wedding","couple","passion","affair","dating"],
        "Thriller": ["chase","conspiracy","danger","threat","spy","heist","mission","race","action","adventure","suspense"],
        "Nonfiction": ["guide","history","science","biography","memoir","how","research","educational","academic"],
        "Historical": ["empire","war","century","king","queen","colonial","ancient","medieval","renaissance","victorian"],
        "Young Adult": ["school","teen","coming","age","friendship","young","adolescent","high school","college"],
        "Horror": ["ghost","haunted","darkness","monster","curse","blood","fear","nightmare","supernatural","paranormal"],
        "Self-Help": ["habit","mindset","improve","productivity","goal","success","anxiety","motivation","personal development"]
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

def analyze_popularity(book_id: str = None, genre: str = None, year_range: List[int] = None) -> Dict:
    """Enhanced popularity analysis with web analytics concepts"""
    global BOOKS
    
    if not BOOKS:
        return {"error": "No books loaded"}
    
    # Filter books based on criteria
    filtered_books = BOOKS.copy()
    
    if book_id:
        filtered_books = [b for b in filtered_books if b["id"] == book_id]
    
    if genre:
        filtered_books = [b for b in filtered_books if genre in b["genres"]]
    
    if year_range and len(year_range) == 2:
        filtered_books = [b for b in filtered_books if year_range[0] <= b["year"] <= year_range[1]]
    
    if not filtered_books:
        return {"error": "No books match the criteria"}
    
    # Calculate popularity metrics
    ratings = [b["avg_rating"] for b in filtered_books]
    counts = [b["ratings_count"] for b in filtered_books]
    pop_scores = [b["pop_score"] for b in filtered_books]
    
    # Popularity trends analysis
    years = [b["year"] for b in filtered_books]
    year_popularity = {}
    for year, pop in zip(years, pop_scores):
        if year not in year_popularity:
            year_popularity[year] = []
        year_popularity[year].append(pop)
    
    year_avg_popularity = {year: np.mean(pops) for year, pops in year_popularity.items()}
    
    # Genre popularity analysis
    genre_popularity = {}
    for book in filtered_books:
        for genre in book["genres"]:
            if genre not in genre_popularity:
                genre_popularity[genre] = []
            genre_popularity[genre].append(book["pop_score"])
    
    genre_avg_popularity = {genre: np.mean(pops) for genre, pops in genre_popularity.items()}
    
    return {
        "total_books": len(filtered_books),
        "average_rating": float(np.mean(ratings)),
        "total_ratings": int(np.sum(counts)),
        "average_popularity_score": float(np.mean(pop_scores)),
        "top_rated_books": sorted(filtered_books, key=lambda x: x["avg_rating"], reverse=True)[:5],
        "most_popular_books": sorted(filtered_books, key=lambda x: x["pop_score"], reverse=True)[:5],
        "year_popularity_trend": year_avg_popularity,
        "genre_popularity": genre_avg_popularity,
        "popularity_distribution": {
            "high_popularity": len([b for b in filtered_books if b["pop_score"] > 0.8]),
            "medium_popularity": len([b for b in filtered_books if 0.5 <= b["pop_score"] <= 0.8]),
            "low_popularity": len([b for b in filtered_books if b["pop_score"] < 0.5])
        }
    }

def add_user_feedback(book_id: str, rating: int, feedback_text: str = None, user_id: str = None):
    """Store user feedback for recommendation improvement"""
    global USER_FEEDBACK
    
    if book_id not in USER_FEEDBACK:
        USER_FEEDBACK[book_id] = []
    
    feedback = {
        "rating": rating,
        "feedback_text": feedback_text,
        "user_id": user_id,
        "timestamp": pd.Timestamp.now().isoformat()
    }
    
    USER_FEEDBACK[book_id].append(feedback)

def get_user_feedback_insights() -> Dict:
    """Analyze user feedback patterns"""
    global USER_FEEDBACK, BOOKS
    
    if not USER_FEEDBACK:
        return {"message": "No user feedback available"}
    
    total_feedback = sum(len(feedbacks) for feedbacks in USER_FEEDBACK.values())
    avg_rating = np.mean([
        feedback["rating"] 
        for feedbacks in USER_FEEDBACK.values() 
        for feedback in feedbacks
    ])
    
    # Find books with most feedback
    feedback_counts = {book_id: len(feedbacks) for book_id, feedbacks in USER_FEEDBACK.items()}
    top_feedback_books = sorted(feedback_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_feedback_count": total_feedback,
        "average_user_rating": float(avg_rating),
        "books_with_most_feedback": top_feedback_books,
        "feedback_distribution": {
            "positive": len([f for feedbacks in USER_FEEDBACK.values() for f in feedbacks if f["rating"] >= 4]),
            "neutral": len([f for feedbacks in USER_FEEDBACK.values() for f in feedbacks if f["rating"] == 3]),
            "negative": len([f for feedbacks in USER_FEEDBACK.values() for f in feedbacks if f["rating"] <= 2])
        }
    }

def recommend_by_query(query: str, top_k=8) -> List[Dict]:
    """Enhanced recommendation with user feedback integration"""
    global VEC, DOC_MATRIX, BOOKS, USER_FEEDBACK
    
    if VEC is None or DOC_MATRIX is None or not BOOKS:
        return []
    
    q_vec = VEC.transform([normalize(query)])
    sim = cosine_similarity(q_vec, DOC_MATRIX)[0]
    pop = np.array([b["pop_score"] for b in BOOKS])
    
    # Incorporate user feedback if available
    feedback_boost = np.ones(len(BOOKS))
    for i, book in enumerate(BOOKS):
        if book["id"] in USER_FEEDBACK:
            avg_feedback_rating = np.mean([f["rating"] for f in USER_FEEDBACK[book["id"]]])
            feedback_boost[i] = 1.0 + (avg_feedback_rating - 3.0) * 0.1  # Boost based on feedback
    
    # Blend similarity, popularity, and feedback
    blend = 0.6*sim + 0.3*pop + 0.1*feedback_boost
    idx = np.argsort(-blend)[:top_k]
    
    out = []
    for i in idx:
        b = BOOKS[i]
        out.append({
            "id": b["id"], "title": b["title"], "genres": b["genres"], "year": b["year"],
            "score": float(blend[i]),
            "why": {"similarity": float(sim[i]), "popularity": float(pop[i]),
                     "genre": classify_match_score(query, b["genres"]),
                     "feedback_boost": float(feedback_boost[i])}
        })
    return out

def classify_match_score(query: str, book_genres: List[str]) -> float:
    preds = [g for g,_ in classify_genres(query, top_k=3)]
    return float(len(set(preds) & set(book_genres))) / max(1, len(set(book_genres)))
