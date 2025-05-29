from fastapi import APIRouter, HTTPException, Query
from app.models import datastore

router = APIRouter(prefix="/explore", tags=["Data Explorer"])

@router.get("/data")
def get_data(start: int = 0, limit: int = 25):
    df = datastore.data_frame
    
    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded yet.")
    
    sliced = df.iloc[start:start+limit].fillna("").to_dict(orient="records")
    
    return {
        "total_rows": len(df),
        "columns": list(df.columns),
        "data": sliced
    }
