import os
from pathlib import Path


# backend/app/config.py
# Project root = RoadGuard-AI/

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ML_DIR = PROJECT_ROOT / "ml"
MODEL_DIR = ML_DIR / "models"
DATA_DIR = ML_DIR / "data" / "processed"
ANALYTICS_DIR = DATA_DIR / "analytics"


# --------------------------------------------------
# ML model files
# --------------------------------------------------

SEVERITY_MODEL_PATH = MODEL_DIR / "severity_model_xgb_balanced.pkl"
SEVERITY_METADATA_PATH = MODEL_DIR / "severity_model_metadata.pkl"
RISK_MODEL_PATH = MODEL_DIR / "risk_analysis_model.pkl"
HOTSPOT_MODEL_PATH = MODEL_DIR / "hotspot_dbscan.pkl"


# --------------------------------------------------
# Analytics files
# --------------------------------------------------

SUMMARY_PATH = ANALYTICS_DIR / "summary.csv"
SEVERITY_SUMMARY_PATH = ANALYTICS_DIR / "severity_summary.csv"
HOURLY_SUMMARY_PATH = ANALYTICS_DIR / "hourly_summary.csv"
TIME_PERIOD_SUMMARY_PATH = ANALYTICS_DIR / "time_period_summary.csv"
DAY_SUMMARY_PATH = ANALYTICS_DIR / "day_summary.csv"
WEATHER_SUMMARY_PATH = ANALYTICS_DIR / "weather_summary.csv"
LIGHTING_SUMMARY_PATH = ANALYTICS_DIR / "lighting_summary.csv"
CAUSE_SUMMARY_PATH = ANALYTICS_DIR / "cause_summary.csv"


# --------------------------------------------------
# API
# --------------------------------------------------

API_PREFIX = os.getenv("API_PREFIX", "/api/v1")

# FRONTEND_URL can be a single origin or a comma-separated list.
# Render env var example:
#   FRONTEND_URL=https://roadguard-ai789.netlify.app,http://localhost:5173
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",              # ✅ env var name
    "http://localhost:5173",     # ✅ default value
)
