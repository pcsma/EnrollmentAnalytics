from fastapi import APIRouter, HTTPException
from app.models import datastore
import pandas as pd

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/trends")
def get_enrollment_trends(date_column: str = "Date Enrolled"):
    df = datastore.data_frame

    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    if date_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{date_column}' not found in dataset.")

    try:
        # Convert to datetime
        df[date_column] = pd.to_datetime(df[date_column], errors='coerce')
        df = df.dropna(subset=[date_column])

        # Group by month-year
        df['Year-Month'] = df[date_column].dt.to_period('M').astype(str)
        trend_data = df.groupby('Year-Month').size().reset_index(name="count")

        return {
            "periods": trend_data["Year-Month"].tolist(),
            "counts": trend_data["count"].tolist()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
