from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import os
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

router = APIRouter(prefix="/predict", tags=["Topic Modeling"])

# Load vectorizer and model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "models")

vectorizer_path = os.path.join(MODEL_DIR, "vectorizer.pkl")
lda_model_path = os.path.join(MODEL_DIR, "lda_model.pkl")

# Check if model files exist
if not os.path.exists(vectorizer_path) or not os.path.exists(lda_model_path):
    raise RuntimeError("Required model files not found in the /models directory.")

try:
    vectorizer: CountVectorizer = joblib.load(vectorizer_path)
    lda_model: LatentDirichletAllocation = joblib.load(lda_model_path)
except Exception as e:
    raise RuntimeError(f"Failed to load LDA model or vectorizer: {e}")

# Input schema
class TopicInput(BaseModel):
    text: str

@router.post("/topic")
def predict_topic(input: TopicInput):
    text = input.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        # Transform input text
        X = vectorizer.transform([text])
        if X.nnz == 0:
            raise HTTPException(status_code=400, detail="Input text does not contain known vocabulary terms.")

        topic_distribution = lda_model.transform(X)[0]

        # Extract top 3 topics
        top_indices = np.argsort(topic_distribution)[::-1][:3]
        result = [
            {"topic": f"Topic {i}", "score": round(topic_distribution[i], 4)}
            for i in top_indices
        ]

        return {
            "input_text": text,
            "top_topics": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Topic prediction failed: {str(e)}")
