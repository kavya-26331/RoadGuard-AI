from functools import lru_cache

import numpy as np
import shap

from app.services.prediction_service import (
    SEVERITY_MAPPING,
    load_severity_model,
    prepare_features,
)


@lru_cache(maxsize=1)
def load_shap_components():
    """
    Load the trained XGBoost pipeline and create a SHAP
    TreeExplainer for the classifier inside the pipeline.
    """

    model = load_severity_model()

    preprocessor = model.named_steps["preprocessor"]

    classifier = model.named_steps["classifier"]

    explainer = shap.TreeExplainer(
        classifier
    )

    return (
        preprocessor,
        classifier,
        explainer,
    )


def _get_class_shap_values(
    shap_values,
    predicted_index: int,
):
    """
    Handle different SHAP output formats for
    multiclass XGBoost models.
    """

    # Some SHAP versions return:
    # [
    #   class_0_values,
    #   class_1_values,
    #   class_2_values
    # ]
    if isinstance(shap_values, list):
        values = np.asarray(
            shap_values[predicted_index]
        )

        return values[0]

    values = np.asarray(
        shap_values
    )

    # Newer multiclass SHAP format:
    # (samples, features, classes)
    if values.ndim == 3:
        return values[
            0,
            :,
            predicted_index,
        ]

    # Binary/single-output style:
    if values.ndim == 2:
        return values[0]

    return values


def _source_feature_name(
    transformed_name: str,
    original_features: list[str],
) -> str:
    """
    Convert a one-hot encoded feature name back to
    its original source feature.

    Example:
        categorical__Weather_conditions_Raining
        ->
        Weather_conditions
    """

    name = transformed_name

    if "__" in name:
        name = name.split(
            "__",
            1,
        )[1]

    candidates = sorted(
        original_features,
        key=len,
        reverse=True,
    )

    for feature in candidates:
        if (
            name == feature
            or name.startswith(
                feature + "_"
            )
        ):
            return feature

    return name


def _human_feature_name(feature: str) -> str:
    names = {
        "hour": "Hour",
        "minute": "Minute",
        "Day_of_week": "Day of week",
        "Age_band_of_driver": "Driver age group",
        "Sex_of_driver": "Driver sex",
        "Educational_level": "Education level",
        "Driving_experience": "Driving experience",
        "Type_of_vehicle": "Vehicle type",
        "Area_accident_occured": "Accident area",
        "Lanes_or_Medians": "Lanes / medians",
        "Road_allignment": "Road alignment",
        "Types_of_Junction": "Junction type",
        "Road_surface_type": "Road surface type",
        "Road_surface_conditions": "Road surface conditions",
        "Light_conditions": "Lighting conditions",
        "Weather_conditions": "Weather conditions",
        "Type_of_collision": "Collision type",
        "Vehicle_movement": "Vehicle movement",
        "Cause_of_accident": "Accident cause",
        "Time_period": "Time period",
        "Is_night": "Night-time condition",
        "Is_weekend": "Weekend condition",
        "Vehicle_driver_relation": "Driver relation",
        "Owner_of_vehicle": "Vehicle ownership",
        "Service_year_of_vehicle": "Vehicle service age",
        "Defect_of_vehicle": "Vehicle defect",
        "Work_of_casuality": "Work of casualty",
        "Fitness_of_casuality": "Fitness of casualty",
        "Pedestrian_movement": "Pedestrian movement",
    }

    return names.get(
        feature,
        feature.replace("_", " "),
    )


def _guidance_for_feature(
    feature: str,
    data: dict,
) -> str | None:
    """
    Convert a model-important condition into
    practical safety guidance.

    These are safety rules based on the entered
    condition; SHAP identifies which conditions
    the model relied on most.
    """

    if feature == "Weather_conditions":
        weather = data[
            "weather_conditions"
        ].strip().lower()

        if weather != "normal":
            return (
                "Adjust speed and following distance "
                "to the current weather conditions."
            )

    if feature == "Road_surface_conditions":
        surface = data[
            "road_surface_conditions"
        ].strip().lower()

        if surface != "dry":
            return (
                "Allow additional stopping distance "
                "on the current road surface."
            )

    if feature == "Light_conditions":
        lighting = data[
            "light_conditions"
        ].strip().lower()

        if "darkness" in lighting:
            return (
                "Use appropriate lighting and reduce "
                "speed when visibility is limited."
            )

    if feature == "Vehicle_movement":
        movement = data[
            "vehicle_movement"
        ].strip().lower()

        if movement in {
            "overtaking",
            "changing lane to the left",
            "changing lane to the right",
        }:
            return (
                "Check surrounding traffic carefully "
                "before changing lane or overtaking."
            )

        if movement == "u-turn":
            return (
                "Check both directions carefully and "
                "complete the U-turn only when the path is clear."
            )

        if movement == "moving backward":
            return (
                "Check for vehicles and pedestrians "
                "carefully before moving backward."
            )

        if movement == "turning left":
            return (
                "Reduce speed and check surrounding "
                "traffic before turning left."
            )

        if movement == "turning right":
            return (
                "Reduce speed and verify the path is "
                "clear before turning right."
            )

    if feature == "Cause_of_accident":
        cause = data[
            "cause_of_accident"
        ].strip().lower()

        if "high speed" in cause:
            return (
                "Reduce speed and keep it appropriate "
                "for the current road conditions."
            )

        if "no distancing" in cause:
            return (
                "Increase following distance from "
                "the vehicle ahead."
            )

        if "overtaking" in cause:
            return (
                "Avoid unnecessary overtaking and "
                "verify visibility before passing."
            )

        if "driving carelessly" in cause:
            return (
                "Maintain focused attention and avoid "
                "unnecessary distractions."
            )

        if "moving backward" in cause:
            return (
                "Check the area behind the vehicle "
                "before reversing."
            )

    if feature == "Types_of_Junction":
        junction = data[
            "types_of_junction"
        ].strip().lower()

        if junction != "no junction":
            return (
                "Approach the junction carefully and "
                "watch for conflicting traffic."
            )

    if feature == "Road_allignment":
        alignment = data[
            "road_allignment"
        ].strip().lower()

        if alignment != "straight road":
            return (
                "Reduce speed appropriately when "
                "approaching curves or slopes."
            )

    if feature == "Lanes_or_Medians":
        return (
            "Maintain lane discipline and check "
            "surrounding traffic before changing position."
        )

    if feature == "Driving_experience":
        experience = data[
            "driving_experience"
        ].strip().lower()

        if (
            experience in {
                "below 1yr",
                "no licence",
            }
        ):
            return (
                "Use conservative speed and allow "
                "additional following distance."
            )

    if feature == "hour":
        hour = int(data["hour"])

        if hour < 6 or hour >= 18:
            return (
                "Use extra caution during reduced-visibility "
                "night-time driving."
            )

    return None


def explain_prediction(
    data: dict,
    predicted_index: int,
) -> dict:
    """
    Generate per-prediction SHAP explanations.

    Returns:
        Top model-contributing features plus
        condition-aware safety guidance.
    """

    preprocessor, _, explainer = (
        load_shap_components()
    )

    X = prepare_features(data)

    X_processed = preprocessor.transform(
        X
    )

    transformed_feature_names = (
        preprocessor.get_feature_names_out()
    )

    original_features = list(
        X.columns
    )

    shap_values = explainer.shap_values(
        X_processed
    )

    class_values = _get_class_shap_values(
        shap_values,
        predicted_index,
    )

    aggregated = {}

    for name, value in zip(
        transformed_feature_names,
        class_values,
    ):
        source_feature = (
            _source_feature_name(
                name,
                original_features,
            )
        )

        aggregated[source_feature] = (
            aggregated.get(
                source_feature,
                0.0,
            )
            + float(value)
        )

    ranked = sorted(
        aggregated.items(),
        key=lambda item: abs(item[1]),
        reverse=True,
    )

    factors = []

    for feature, contribution in ranked[:6]:
        factors.append(
            {
                "feature": feature,
                "label": _human_feature_name(
                    feature
                ),
                "value": str(
                    data.get(
                        _data_key_for_feature(
                            feature
                        ),
                        "",
                    )
                ),
                "contribution": round(
                    contribution,
                    4,
                ),
                "impact": (
                    "increases"
                    if contribution > 0
                    else "decreases"
                ),
            }
        )

    guidance = []

    for factor in factors:
        recommendation = (
            _guidance_for_feature(
                factor["feature"],
                data,
            )
        )

        if (
            recommendation
            and recommendation not in guidance
        ):
            guidance.append(
                recommendation
            )

    return {
        "factors": factors,
        "guidance": guidance[:3],
    }


def _data_key_for_feature(
    feature: str,
) -> str:
    mapping = {
        "Day_of_week": "day_of_week",
        "Age_band_of_driver": "age_band_of_driver",
        "Sex_of_driver": "sex_of_driver",
        "Educational_level": "educational_level",
        "Driving_experience": "driving_experience",
        "Type_of_vehicle": "type_of_vehicle",
        "Area_accident_occured": "area_accident_occured",
        "Lanes_or_Medians": "lanes_or_medians",
        "Road_allignment": "road_allignment",
        "Types_of_Junction": "types_of_junction",
        "Road_surface_type": "road_surface_type",
        "Road_surface_conditions": "road_surface_conditions",
        "Light_conditions": "light_conditions",
        "Weather_conditions": "weather_conditions",
        "Type_of_collision": "type_of_collision",
        "Vehicle_movement": "vehicle_movement",
        "Cause_of_accident": "cause_of_accident",
        "hour": "hour",
        "minute": "minute",
    }

    return mapping.get(
        feature,
        feature,
    )