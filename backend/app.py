from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import RecommendRequest, ClassifyRequest
from ir_agents import load_books, BOOKS, recommend_by_query, classify_genres
import pandas as pd
import io

app = FastAPI(title="BookRec-AgenticAI (IRWA Demo)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
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
