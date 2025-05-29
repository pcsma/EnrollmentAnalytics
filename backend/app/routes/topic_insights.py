# BACKEND: topic_insights.py
from fastapi import APIRouter, HTTPException, Query
from app.models import datastore
import pandas as pd
import joblib
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from typing import Optional
from wordcloud import WordCloud
import io
import base64

router = APIRouter(prefix="/analytics", tags=["Topic Insights"])

# Load vectorizer and LDA model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "models")

vectorizer_path = os.path.join(MODEL_DIR, "vectorizer.pkl")
lda_model_path = os.path.join(MODEL_DIR, "lda_model.pkl")

try:
    vectorizer: CountVectorizer = joblib.load(vectorizer_path)
    lda_model: LatentDirichletAllocation = joblib.load(lda_model_path)
except Exception as e:
    raise RuntimeError(f"Failed to load topic model: {e}")


def generate_wordcloud(text_list):
    text = ' '.join(text_list)
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    img_io = io.BytesIO()
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    plt.tight_layout()
    plt.savefig(img_io, format='png')
    plt.close()
    img_io.seek(0)
    return base64.b64encode(img_io.read()).decode()


@router.get("/topic-insights")
def get_topic_insights(enrolled_only: Optional[str] = Query("false")):
    enrolled_only = enrolled_only.lower() == "true"
    df = datastore.data_frame.copy()

    if df.empty:
        raise HTTPException(status_code=404, detail="No data uploaded.")

    if 'How did you come to know NU?' not in df.columns or 'Reasons for Choosing NU?' not in df.columns:
        raise HTTPException(status_code=400, detail="Required text columns are missing.")

    if enrolled_only and 'enrolled' not in df.columns:
        raise HTTPException(status_code=400, detail="'enrolled' column missing.")

    # Clean and combine
    df = df.fillna('')
    if enrolled_only:
        df = df[df['enrolled'] == 1]
    text_data = df[['How did you come to know NU?', 'Reasons for Choosing NU?']].agg(' '.join, axis=1)

    # Vectorize and transform
    X = vectorizer.transform(text_data)
    topic_matrix = lda_model.transform(X)

    # Get top keywords per topic
    keywords = []
    vocab = vectorizer.get_feature_names_out()
    for i, topic in enumerate(lda_model.components_):
        top_indices = topic.argsort()[-10:][::-1]
        top_words = [(vocab[idx], round(topic[idx], 2)) for idx in top_indices]
        keywords.append({"topic": f"Topic {i+1}", "keywords": top_words})

    # Word cloud
    wordcloud_b64 = generate_wordcloud(text_data.tolist())

    print("✅ Done generating insights")

    return {
        "keywords": keywords,
        "wordcloud": wordcloud_b64,
        "count": len(text_data),
        "enrolled_only": enrolled_only
    }


@router.get("/topic-labels")
def get_topic_labels(n_top_words: int = 5):
    try:
        feature_names = vectorizer.get_feature_names_out()
        topic_labels = []

        for topic_idx, topic in enumerate(lda_model.components_):
            top_indices = topic.argsort()[-n_top_words:][::-1]
            top_words = [feature_names[i] for i in top_indices]
            label = ', '.join(top_words)
            topic_labels.append({
                "topic_index": topic_idx,
                "label": label,
                "keywords": top_words
            })

        return {"topics": topic_labels}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract topic labels: {e}")
