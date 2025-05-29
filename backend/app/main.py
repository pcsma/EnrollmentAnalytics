from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 👈 Import CORS middleware

from app.routes import (
    upload,
    trends,
    demographics,
    programs,
    data,
    predict_enrollment,
    predict_topic,
    explorer,
    topic_insights
)

app = FastAPI(title="Enrollment Analytics API")

# 👇 Add this block to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Routers
app.include_router(upload.router)
app.include_router(trends.router)
app.include_router(demographics.router)
app.include_router(programs.router)
app.include_router(data.router)
app.include_router(predict_enrollment.router)
app.include_router(predict_topic.router)
app.include_router(explorer.router)
app.include_router(topic_insights.router)

