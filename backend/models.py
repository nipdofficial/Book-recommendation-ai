from pydantic import BaseModel, Field
from typing import List, Optional

class Book(BaseModel):
    id: str
    title: str
    summary: str
    genres: List[str] = Field(default_factory=list)
    year: int
    avg_rating: float
    ratings_count: int

class RecommendRequest(BaseModel):
    query: str
    top_k: int = 8

class ClassifyRequest(BaseModel):
    text: str

class GenreClassificationRequest(BaseModel):
    text: str
    top_k: int = 5

class PopularityAnalysisRequest(BaseModel):
    book_id: Optional[str] = None
    genre: Optional[str] = None
    year_range: Optional[List[int]] = None

class UserFeedbackRequest(BaseModel):
    book_id: str
    rating: int = Field(ge=1, le=5)
    feedback_text: Optional[str] = None
    user_id: Optional[str] = None

class DataPreprocessingRequest(BaseModel):
    clean_data: bool = True
    remove_duplicates: bool = True
    standardize_genres: bool = True
