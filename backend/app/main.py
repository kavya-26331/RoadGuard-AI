from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import API_PREFIX, FRONTEND_URL

from app.api.predict import router as predict_router
from app.api.hotspots import router as hotspot_router
from app.api.analytics import router as analytics_router


app = FastAPI(
    title="RoadGuard AI",
    description=(
        "Road Safety Intelligence API for accident "
        "severity prediction, risk analysis, and "
        "accident pattern detection."
    ),
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API ROUTES
# --------------------------------------------------

app.include_router(
    predict_router,
    prefix=API_PREFIX,
)

app.include_router(
    hotspot_router,
    prefix=API_PREFIX,
)

app.include_router(
    analytics_router,
    prefix=API_PREFIX,
)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "project": "RoadGuard AI",
        "status": "running",
        "version": "1.0.0",
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/v1/health")
def health():
    return {
        "status": "healthy",
        "service": "RoadGuard AI API",
    }