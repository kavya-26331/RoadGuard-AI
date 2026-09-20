from functools import lru_cache

import joblib
import numpy as np
import pandas as pd

from app.config import HOTSPOT_MODEL_PATH


@lru_cache(maxsize=1)
def load_hotspot_model():
    return joblib.load(HOTSPOT_MODEL_PATH)


def _is_night(hour: int) -> int:
    return int(hour < 6 or hour >= 18)


def _is_weekend(day: str) -> int:
    return int(
        day.strip().lower() in {"saturday", "sunday"}
    )


def prepare_hotspot_features(data: dict) -> pd.DataFrame:
    hour = int(data["hour"])

    return pd.DataFrame(
        [
            {
                "hour": hour,
                "Is_night": _is_night(hour),
                "Is_weekend": _is_weekend(
                    data["day_of_week"]
                ),
                "Day_of_week": data["day_of_week"],
                "Types_of_Junction": data[
                    "types_of_junction"
                ],
                "Road_surface_conditions": data[
                    "road_surface_conditions"
                ],
                "Light_conditions": data[
                    "light_conditions"
                ],
                "Weather_conditions": data[
                    "weather_conditions"
                ],
                "Vehicle_movement": data[
                    "vehicle_movement"
                ],
                "Cause_of_accident": data[
                    "cause_of_accident"
                ],
            }
        ]
    )


def _assign_to_existing_cluster(
    X_scaled: np.ndarray,
    dbscan,
) -> int:
    """
    Assign a new observation to a learned DBSCAN
    core sample only when the observation is close
    enough to an existing learned pattern.

    Returns:
        Existing cluster label, or -1 when no strong
        recurring pattern is detected.
    """

    if not hasattr(dbscan, "components_"):
        return -1

    if not hasattr(dbscan, "core_sample_indices_"):
        return -1

    if not hasattr(dbscan, "labels_"):
        return -1

    components = np.asarray(
        dbscan.components_,
        dtype=float,
    )

    if components.ndim != 2:
        return -1

    if len(components) == 0:
        return -1

    point = np.asarray(
        X_scaled[0],
        dtype=float,
    )

    distances = np.linalg.norm(
        components - point,
        axis=1,
    )

    nearest_index = int(
        np.argmin(distances)
    )

    nearest_distance = float(
        distances[nearest_index]
    )

    eps = float(
        getattr(dbscan, "eps", 1.5)
    )

    # DBSCAN was trained with eps=1.5.
    # A stricter fraction is used for inference so
    # loosely similar observations are not automatically
    # treated as recurring accident patterns.
    matching_threshold = eps * 0.35

    if nearest_distance > matching_threshold:
        return -1

    core_sample_indices = np.asarray(
        dbscan.core_sample_indices_
    )

    if nearest_index >= len(
        core_sample_indices
    ):
        return -1

    core_sample_index = int(
        core_sample_indices[nearest_index]
    )

    labels = np.asarray(
        dbscan.labels_
    )

    if (
        core_sample_index < 0
        or core_sample_index >= len(labels)
    ):
        return -1

    label = int(
        labels[core_sample_index]
    )

    # DBSCAN uses -1 for noise.
    if label == -1:
        return -1

    return label


def detect_pattern(data: dict) -> str:
    model_data = load_hotspot_model()

    preprocessor = model_data["preprocessor"]
    pca = model_data["pca"]
    scaler = model_data["scaler"]
    dbscan = model_data["dbscan"]

    X = prepare_hotspot_features(data)

    X_processed = preprocessor.transform(X)

    X_pca = pca.transform(
        X_processed
    )

    X_scaled = scaler.transform(
        X_pca
    )

    label = _assign_to_existing_cluster(
        X_scaled,
        dbscan,
    )

    if label == -1:
        return (
            "No strong recurring accident pattern detected"
        )

    return (
        "Recurring accident pattern detected"
    )