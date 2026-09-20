from fastapi import APIRouter

from app.schemas.prediction import PredictionRequest
from app.services.hotspot_service import detect_pattern


router = APIRouter(
    prefix="/hotspots",
    tags=["Hotspots"],
)


@router.post("/analyze")
def analyze_hotspot_pattern(
    request: PredictionRequest,
):
    data = request.model_dump()

    pattern = detect_pattern(data)

    return {
        "pattern_match": pattern
    }