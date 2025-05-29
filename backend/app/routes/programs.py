from fastapi import APIRouter, HTTPException
from app.models import datastore
import pandas as pd

router = APIRouter(prefix="/analytics/programs", tags=["Program Comparison"])

@router.get("/")
def program_comparison():
    df = datastore.data_frame
    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    if "course" not in df.columns or "gender" not in df.columns:
        raise HTTPException(status_code=400, detail="'course' and 'gender' columns are required.")

    # Clean columns
    df["course"] = df["course"].astype(str).str.strip()
    df["gender"] = df["gender"].astype(str).str.strip().str.upper()

    if "age" in df.columns:
        df["age"] = pd.to_numeric(df["age"], errors="coerce")

    programs = []

    for course_name, group in df.groupby("course"):
        total = len(group)
        male = len(group[group["gender"] == "MALE"])
        female = len(group[group["gender"] == "FEMALE"])
        avg_age = round(group["age"].mean(), 1) if "age" in group.columns and not group["age"].isna().all() else None

        programs.append({
            "program": course_name,
            "total": total,
            "male": male,
            "female": female,
            "average_age": avg_age
        })

    return sorted(programs, key=lambda x: x["total"], reverse=True)
