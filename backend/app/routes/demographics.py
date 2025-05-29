from fastapi import APIRouter, HTTPException, Query
from app.models import datastore
import pandas as pd

router = APIRouter(prefix="/analytics/demographics", tags=["Analytics"])

@router.get("/gender")
def gender_distribution():
    return compute_counts("gender")

@router.get("/course")
def course_distribution():
    return compute_counts("course")  # or "program" if that's the column name

@router.get("/age")
def age_distribution():
    df = datastore.data_frame
    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")
    
    if 'age' not in df.columns:
        raise HTTPException(status_code=400, detail="'age' column not found.")

    df = df.copy()
    df['age'] = pd.to_numeric(df['age'], errors='coerce')
    df = df.dropna(subset=['age'])
    df = df[df['age'].between(10, 100)]

    # Bucket into age groups
    bins = [0, 17, 24, 34, 44, 54, 64, 200]
    labels = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+']
    df['age_group'] = pd.cut(df['age'], bins=bins, labels=labels, right=False)

    age_counts = df['age_group'].value_counts().sort_index()
    return {
        "labels": age_counts.index.tolist(),
        "counts": age_counts.tolist(),
        "average": round(df['age'].mean(), 1),
        "median": int(df['age'].median()),
        "youngest": int(df['age'].min()),
        "oldest": int(df['age'].max())
    }




# Helper
def compute_counts(field: str):
    df = datastore.data_frame
    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")
    
    if field not in df.columns:
        raise HTTPException(status_code=400, detail=f"'{field}' column not found.")

    counts = df[field].dropna().astype(str).str.strip().value_counts()
    return {
        "labels": counts.index.tolist(),
        "counts": counts.tolist()
    }
