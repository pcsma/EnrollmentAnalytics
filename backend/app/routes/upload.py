from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from app.models import datastore

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/", summary="Upload File", description="Upload a CSV or Excel file")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV or Excel files are supported.")

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        # Normalize column names
        df.columns = df.columns.str.strip().str.lower()

        # Auto-map key columns if found
        column_map = {}
        for col in df.columns:
            if "how did you come" in col:
                column_map[col] = "How did you come to know NU?"
            elif "reasons for choosing" in col:
                column_map[col] = "Reasons for Choosing NU?"
            elif "enrolled" in col:
                column_map[col] = "enrolled"

        df.rename(columns=column_map, inplace=True)

        # Set globally for other modules
        datastore.data_frame = df

        # Prepare preview
        preview = df.head(5).fillna("").to_dict(orient="records")

        return {
            "message": "File uploaded and parsed successfully",
            "rows": len(df),
            "columns": list(df.columns),
            "preview": preview
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
