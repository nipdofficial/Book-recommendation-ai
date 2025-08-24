from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models import RecommendRequest, ClassifyRequest, GenreClassificationRequest, PopularityAnalysisRequest, UserFeedbackRequest, DataPreprocessingRequest
from ir_agents import (
    load_books, BOOKS, recommend_by_query, classify_genres, analyze_popularity, 
    add_user_feedback, get_user_feedback_insights, preprocess_data,
    VEC, DOC_MATRIX, GENRE_CLASSIFIER, LABEL_ENCODER
)
import pandas as pd
import io

app = FastAPI(
    title="BookRec - Agentic AI System",
    description="Information Retrieval & Web Analytics Project - Multi-agent AI-based Book Recommendation System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"status": "ok", "books_loaded": len(BOOKS)}

@app.post("/ingest/csv")
async def ingest_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Please upload a CSV file.")
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    load_books(df)
    return {"ok": True, "count": len(BOOKS)}

@app.get("/books")
def list_books(limit: int = 25):
    return {"count": len(BOOKS), "items": BOOKS[:limit]}

@app.post("/classify")
def classify(req: ClassifyRequest):
    return {"genres": classify_genres(req.text, top_k=3)}

@app.post("/recommend")
def recommend(req: RecommendRequest):
    res = recommend_by_query(req.query, top_k=req.top_k)
    return {"results": res}

# New endpoints for the 4 main functions

@app.post("/function1/preprocess")
async def function1_preprocess(file: UploadFile = File(...), config: DataPreprocessingRequest = None):
    """Function 1: Data Collection & Preprocessing (IR Concept)"""
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Please upload a CSV file.")
    
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    
    if config:
        df_processed = preprocess_data(df, config.clean_data, config.remove_duplicates, config.standardize_genres)
    else:
        df_processed = preprocess_data(df)
    
    # Load the processed data
    load_books(df_processed)
    
    return {
        "message": "Data preprocessing completed successfully",
        "original_count": len(df),
        "processed_count": len(df_processed),
        "books_loaded": len(BOOKS),
        "preprocessing_stats": {
            "total_books": len(df_processed),
            "unique_genres": len(set([genre for book in BOOKS for genre in book.get("genres", [])])),
            "average_rating": df_processed["avg_rating"].mean() if "avg_rating" in df_processed.columns else 0,
            "duplicates_removed": len(df) - len(df_processed) if config and config.remove_duplicates else 0,
            "data_cleaned": config.clean_data if config else True,
            "genres_standardized": config.standardize_genres if config else True
        },
        "sample_books": BOOKS[:5] if BOOKS else []
    }

@app.post("/function2/classify-genres")
def function2_classify_genres(req: GenreClassificationRequest):
    """Function 2: Genre Classification (IR & NLP Concept)"""
    genres = classify_genres(req.text, top_k=req.top_k)
    return {
        "input_text": req.text,
        "genre_predictions": [{"genre": genre, "confidence": score} for genre, score in genres],
        "primary_genre": genres[0][0] if genres else "Unknown",
        "confidence_scores": {genre: score for genre, score in genres},
        "nlp_techniques_used": ["TF-IDF Vectorization", "Machine Learning Classification", "Rule-based Fallback"]
    }

@app.post("/function3/analyze-popularity")
def function3_analyze_popularity(req: PopularityAnalysisRequest):
    """Function 3: Popularity Analyzer (Web Analytics Concept)"""
    analysis = analyze_popularity(
        book_id=req.book_id,
        genre=req.genre,
        year_range=req.year_range
    )
    return {
        "popularity_analysis": analysis,
        "web_analytics_metrics": {
            "total_books_analyzed": analysis.get("total_books", 0),
            "popularity_distribution": analysis.get("popularity_distribution", {}),
            "trend_analysis": "Year-over-year popularity trends available" if analysis.get("year_popularity_trend") else "No trend data"
        }
    }

@app.post("/function4/enhanced-recommendation")
def function4_enhanced_recommendation(req: RecommendRequest):
    """Function 4: Suggestion Agent (Hybrid IR + Web Analytics Concept)"""
    recommendations = recommend_by_query(req.query, top_k=req.top_k)
    
    # Get user feedback insights
    feedback_insights = get_user_feedback_insights()
    
    return {
        "query": req.query,
        "recommendations": recommendations,
        "recommendation_algorithm": "Hybrid Content-Based + Collaborative + Popularity",
        "ir_techniques": ["TF-IDF Vectorization", "Cosine Similarity", "Content-Based Filtering"],
        "web_analytics_integration": {
            "popularity_scoring": "Bayesian average with minimum threshold",
            "user_feedback_loop": "Feedback-based recommendation boosting",
            "feedback_insights": feedback_insights
        },
        "total_recommendations": len(recommendations)
    }

@app.post("/feedback")
def submit_feedback(req: UserFeedbackRequest):
    """Submit user feedback for recommendation improvement"""
    add_user_feedback(req.book_id, req.rating, req.feedback_text, req.user_id)
    return {
        "message": "Feedback submitted successfully",
        "book_id": req.book_id,
        "rating": req.rating,
        "feedback_count": len(get_user_feedback_insights().get("books_with_most_feedback", []))
    }

@app.get("/feedback/insights")
def get_feedback_insights():
    """Get insights from user feedback"""
    return get_user_feedback_insights()

@app.get("/system/status")
def system_status():
    """Get comprehensive system status"""
    return {
        "system": "BookRec-AgenticAI System",
        "status": "operational",
        "books_loaded": len(BOOKS),
        "functions_available": [
            "Data Collection & Preprocessing",
            "Genre Classification", 
            "Popularity Analysis",
            "Enhanced Recommendation"
        ],
        "ir_components": {
            "tfidf_vectorizer": VEC is not None if 'VEC' in globals() else False,
            "document_matrix": DOC_MATRIX is not None if 'DOC_MATRIX' in globals() else False,
            "genre_classifier": "ML-based + Rule-based fallback",
            "popularity_analyzer": "Bayesian scoring + Trend analysis"
        },
        "responsible_ai_features": [
            "Data preprocessing and validation",
            "Transparent recommendation scoring",
            "User feedback integration",
            "Explainable AI with confidence scores"
        ]
    }
