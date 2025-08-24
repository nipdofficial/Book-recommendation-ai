# Book Recommendation AI (IRWA Demo)

**Mid-eval ready**: Upload CSV → Ingest → Query → Recommend.

## Run backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

## Demo
1. Upload `backend/data/seed_books.csv`.
2. Click **Ingest**.
3. Enter a query like: `fast-paced space adventure with AI companions`.
4. Click **Recommend**.

Scores shown:
- **similarity** (TF-IDF cosine) — IR
- **popularity** (smoothed rating×count) — Web Analytics
- **genre** (keyword overlap) — NLP/IR
