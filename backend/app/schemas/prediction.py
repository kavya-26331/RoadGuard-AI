from typing import Dict, List

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    day_of_week: str
    age_band_of_driver: str
    sex_of_driver: str
    educational_level: str
    driving_experience: str
    type_of_vehicle: str
    area_accident_occured: str
    lanes_or_medians: str
    road_allignment: str
    types_of_junction: str
    road_surface_type: str
    road_surface_conditions: str
    light_conditions: str
    weather_conditions: str
    type_of_collision: str
    vehicle_movement: str
    cause_of_accident: str

    hour: int = Field(
        ...,
        ge=0,
        le=23,
    )

    minute: int = Field(
        ...,
        ge=0,
        le=59,
    )


class ShapFactor(BaseModel):
    feature: str
    label: str
    value: str
    contribution: float
    impact: str


class PredictionResponse(BaseModel):
    predicted_severity: str

    confidence: float

    probabilities: Dict[str, float]

    risk_level: str

    risk_index: float

    pattern_match: str

    key_factors: List[str]

    shap_factors: List[ShapFactor]

    shap_guidance: List[str]

    recommendation: str