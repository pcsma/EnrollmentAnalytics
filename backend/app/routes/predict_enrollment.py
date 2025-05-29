from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models import datastore
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

router = APIRouter(prefix="/analytics", tags=["Enrollment Prediction"])

class PredictInput(BaseModel):
    age: int
    gender: str
    course: str

@router.post("/predict-enrollment")
def predict_enrollment(input: PredictInput):
    df = datastore.data_frame.copy()

    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    # Ensure required columns exist
    required_cols = ['age', 'gender', 'course', 'entry level']
    for col in required_cols:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Missing '{col}' column in dataset")

    # Preprocess
    df = df[required_cols].dropna()
    df = df[df['entry level'].isin(['FRESHMAN', 'TRANSFEREE'])]

    X = df[['age', 'gender', 'course']]
    y = df['entry level']

    # Encode categorical
    encoders = {
        'gender': LabelEncoder(),
        'course': LabelEncoder(),
        'entry level': LabelEncoder()
    }
    X['gender'] = encoders['gender'].fit_transform(X['gender'].astype(str))
    X['course'] = encoders['course'].fit_transform(X['course'].astype(str))
    y = encoders['entry level'].fit_transform(y)

    # Train model
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)

    # Prepare input
    input_data = pd.DataFrame([{
        'age': input.age,
        'gender': input.gender,
        'course': input.course
    }])
    input_data['gender'] = encoders['gender'].transform(input_data['gender'].astype(str))
    input_data['course'] = encoders['course'].transform(input_data['course'].astype(str))

    pred = model.predict(input_data)[0]
    label = encoders['entry level'].inverse_transform([pred])[0]

    return {"predicted_entry_level": label}
