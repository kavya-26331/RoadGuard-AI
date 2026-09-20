from functools import lru_cache

import joblib
import pandas as pd

from app.config import (
    RISK_MODEL_PATH,
    SEVERITY_METADATA_PATH,
    SEVERITY_MODEL_PATH,
)


SEVERITY_MAPPING = {
    0: "Slight Injury",
    1: "Serious Injury",
    2: "Fatal injury",
}


def _time_period(hour: int) -> str:
    if 5 <= hour < 12:
        return "Morning"

    if 12 <= hour < 17:
        return "Afternoon"

    if 17 <= hour < 21:
        return "Evening"

    return "Night"


def _is_night(hour: int) -> int:
    return int(hour < 6 or hour >= 18)


def _is_weekend(day: str) -> int:
    return int(
        day.strip().lower()
        in {"saturday", "sunday"}
    )


@lru_cache(maxsize=1)
def load_severity_model():
    return joblib.load(SEVERITY_MODEL_PATH)


@lru_cache(maxsize=1)
def load_severity_metadata():
    return joblib.load(SEVERITY_METADATA_PATH)


@lru_cache(maxsize=1)
def load_risk_model():
    return joblib.load(RISK_MODEL_PATH)


def prepare_features(data: dict) -> pd.DataFrame:
    hour = int(data["hour"])
    minute = int(data["minute"])
    day = data["day_of_week"]

    features = {
        "Day_of_week": day,

        "Age_band_of_driver":
            data["age_band_of_driver"],

        "Sex_of_driver":
            data["sex_of_driver"],

        "Educational_level":
            data["educational_level"],

        # These variables are not exposed
        # in the current assessment form.
        "Vehicle_driver_relation":
            "Employee",

        "Driving_experience":
            data["driving_experience"],

        "Type_of_vehicle":
            data["type_of_vehicle"],

        "Owner_of_vehicle":
            "Owner",

        "Service_year_of_vehicle":
            "Unknown",

        "Defect_of_vehicle":
            "No defect",

        "Area_accident_occured":
            data["area_accident_occured"],

        "Lanes_or_Medians":
            data["lanes_or_medians"],

        "Road_allignment":
            data["road_allignment"],

        "Types_of_Junction":
            data["types_of_junction"],

        "Road_surface_type":
            data["road_surface_type"],

        "Road_surface_conditions":
            data["road_surface_conditions"],

        "Light_conditions":
            data["light_conditions"],

        "Weather_conditions":
            data["weather_conditions"],

        "Type_of_collision":
            data["type_of_collision"],

        "Vehicle_movement":
            data["vehicle_movement"],

        "Work_of_casuality":
            "Unknown",

        "Fitness_of_casuality":
            "Normal",

        "Pedestrian_movement":
            "Not a Pedestrian",

        "Cause_of_accident":
            data["cause_of_accident"],

        "hour":
            hour,

        "minute":
            minute,

        "Time_period":
            _time_period(hour),

        "Is_night":
            _is_night(hour),

        "Is_weekend":
            _is_weekend(day),
    }

    return pd.DataFrame([features])


def predict_severity(data: dict) -> dict:
    model = load_severity_model()

    X = prepare_features(data)

    prediction = model.predict(X)[0]

    probabilities = model.predict_proba(X)[0]

    prediction_index = int(prediction)

    confidence = float(
        probabilities[prediction_index] * 100
    )

    severity = SEVERITY_MAPPING.get(
        prediction_index,
        "Unknown",
    )

    probability_dict = {
        SEVERITY_MAPPING[index]:
            round(float(probabilities[index]) * 100, 2)
        for index in range(len(probabilities))
        if index in SEVERITY_MAPPING
    }

    return {
        "predicted_severity": severity,
        "confidence": round(confidence, 2),
        "probabilities": probability_dict,
    }


def _normalize_rate(value) -> float | None:
    """
    Convert a stored severe rate into a proportion.

    Examples:
        15.44   -> 0.1544
        0.1544  -> 0.1544
    """

    try:
        rate = float(value)
    except (TypeError, ValueError):
        return None

    if rate > 1:
        rate = rate / 100.0

    if rate < 0:
        return None

    return rate


def _get_row_value(
    row: dict,
    candidates: list[str],
):
    """
    Find a value in a dictionary using
    case-insensitive field matching.
    """

    normalized = {
        str(key).strip().lower(): value
        for key, value in row.items()
    }

    for candidate in candidates:
        value = normalized.get(
            candidate.strip().lower()
        )

        if value is not None:
            return value

    return None


def _find_group_severity_index(
    rows: list[dict],
    target_value,
    key_candidates: list[str],
    baseline: float,
):
    """
    Find the historical severe rate for one subgroup
    and convert it into an observed severity index.

    Index definition:

        subgroup severe rate / overall severe rate
    """

    if not rows or baseline <= 0:
        return None

    target_normalized = str(
        target_value
    ).strip().lower()

    for row in rows:
        row_group = _get_row_value(
            row,
            key_candidates,
        )

        if row_group is None:
            continue

        # Numeric comparison, mainly for hour.
        if isinstance(target_value, int):
            try:
                if int(row_group) != target_value:
                    continue
            except (TypeError, ValueError):
                continue

        # String comparison for day, weather,
        # lighting, and time period.
        else:
            if (
                str(row_group)
                .strip()
                .lower()
                != target_normalized
            ):
                continue

        severe_rate = _get_row_value(
            row,
            [
                "Severe_Rate",
                "severe_rate",
                "severe_percentage",
                "severe_percent",
            ],
        )

        severe_rate = _normalize_rate(
            severe_rate
        )

        if severe_rate is None:
            return None

        return severe_rate / baseline

    return None


def calculate_risk_index(data: dict) -> float:
    """
    Calculate a composite observed severity index.

    The saved risk-analysis artifact contains historical
    severe-outcome rates for:

        - hour
        - time period
        - day of week
        - weather
        - lighting

    Each subgroup is converted to an index relative to
    the overall historical severe-outcome baseline.

    The final index is the arithmetic mean of the
    available subgroup indices.

    This is NOT an accident probability.
    It represents observed historical severe-outcome
    patterns in the dataset.
    """

    risk_model = load_risk_model()

    try:
        baseline = float(
            risk_model["overall_severe_rate"]
        )
    except (
        KeyError,
        TypeError,
        ValueError,
    ):
        return 1.0

    # Support either proportion or percentage
    # representation in the saved artifact.
    if baseline > 1:
        baseline = baseline / 100.0

    if baseline <= 0:
        return 1.0

    hour = int(data["hour"])
    day = data["day_of_week"]
    time_period = _time_period(hour)
    weather = data["weather_conditions"]
    lighting = data["light_conditions"]

    indices = []

    # -------------------------------------------------
    # 1. Hour
    # -------------------------------------------------
    hourly_index = _find_group_severity_index(
        risk_model.get("hourly", []),
        hour,
        [
            "hour",
        ],
        baseline,
    )

    if hourly_index is not None:
        indices.append(hourly_index)

    # -------------------------------------------------
    # 2. Time period
    # -------------------------------------------------
    time_period_index = _find_group_severity_index(
        risk_model.get("time_period", []),
        time_period,
        [
            "Time_period",
            "time_period",
            "period",
        ],
        baseline,
    )

    if time_period_index is not None:
        indices.append(time_period_index)

    # -------------------------------------------------
    # 3. Day of week
    # -------------------------------------------------
    day_index = _find_group_severity_index(
        risk_model.get("day_of_week", []),
        day,
        [
            "Day_of_week",
            "day_of_week",
            "day",
        ],
        baseline,
    )

    if day_index is not None:
        indices.append(day_index)

    # -------------------------------------------------
    # 4. Weather
    # -------------------------------------------------
    weather_index = _find_group_severity_index(
        risk_model.get("weather", []),
        weather,
        [
            "Weather_conditions",
            "weather_conditions",
            "weather",
        ],
        baseline,
    )

    if weather_index is not None:
        indices.append(weather_index)

    # -------------------------------------------------
    # 5. Lighting
    # -------------------------------------------------
    lighting_index = _find_group_severity_index(
        risk_model.get("lighting", []),
        lighting,
        [
            "Light_conditions",
            "light_conditions",
            "lighting",
            "light",
        ],
        baseline,
    )

    if lighting_index is not None:
        indices.append(lighting_index)

    # If no subgroup matched, use the neutral baseline.
    if not indices:
        return 1.0

    composite_index = sum(indices) / len(indices)

    return round(composite_index, 2)