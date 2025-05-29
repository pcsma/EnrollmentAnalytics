from fastapi import APIRouter, HTTPException, Query
from app.models import datastore
import pandas as pd

router = APIRouter(prefix="/analytics/explorer", tags=["Data Explorer"])

@router.get("/all")
def get_all_explorer_data():
    df = datastore.data_frame.copy()

    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    records = df.fillna("").to_dict(orient="records")
    return {
        "records": records
    }


# 1. Raw Data with Pagination and Search
@router.get("/")
def get_explorer_data(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query("", description="Search filter across all fields")
):
    df = datastore.data_frame.copy()

    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    # Apply search
    if search:
        search = search.lower()
        df = df[df.apply(lambda row: row.astype(str).str.lower().str.contains(search).any(), axis=1)]

    total = len(df)
    start = (page - 1) * limit
    end = start + limit
    records = df.iloc[start:end].fillna("").to_dict(orient="records")

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1) // limit,
        "records": records
    }

# 2. Numerical Column Summary
@router.get("/summary")
def get_column_summary():
    df = datastore.data_frame.copy()

    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    numeric_summary = df.select_dtypes(include="number").describe().to_dict()
    categorical_columns = list(df.select_dtypes(include="object").columns)

    return {
        "numeric": numeric_summary,
        "categorical_columns": categorical_columns
    }

# 3. Categorical Column Breakdown
@router.get("/category-summary")
def category_summary(column: str = Query(..., description="Column to summarize")):
    df = datastore.data_frame.copy()

    if column not in df.columns:
        raise HTTPException(status_code=400, detail="Invalid column name.")

    counts = df[column].fillna("NaN").astype(str).value_counts()
    return {
        "labels": counts.index.tolist(),
        "counts": counts.tolist()
    }
