from pydantic import BaseModel, Field
from typing import List

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
