from fastapi import APIRouter

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)

from app.services.explanation_service import (
    determine_risk_level,
    generate_key_factors,
    generate_recommendation,
)

from app.services.hotspot_service import (
    detect_pattern,
)

from app.services.prediction_service import (
    SEVERITY_MAPPING,
    calculate_risk_index,
    predict_severity,
)

from app.services.shap_service import (
    explain_prediction,
)


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"],
)


@router.post(
    "",
    response_model=PredictionResponse,
)
def predict(
    request: PredictionRequest,
):
    # -------------------------------------------------
    # Convert Pydantic request to dictionary
    # -------------------------------------------------
    data = request.model_dump()


    # -------------------------------------------------
    # XGBoost severity prediction
    # -------------------------------------------------
    severity_result = predict_severity(
        data
    )


    # -------------------------------------------------
    # Find predicted class index
    # -------------------------------------------------
    predicted_index = next(
        (
            index
            for index, label in SEVERITY_MAPPING.items()
            if label
            == severity_result[
                "predicted_severity"
            ]
        ),
        0,
    )


    # -------------------------------------------------
    # SHAP explanation
    # -------------------------------------------------
    shap_result = explain_prediction(
        data,
        predicted_index,
    )


    # -------------------------------------------------
    # Historical observed severity index
    # -------------------------------------------------
    risk_index = calculate_risk_index(
        data
    )


    # -------------------------------------------------
    # Risk level
    # -------------------------------------------------
    risk_level = determine_risk_level(
        risk_index
    )


    # -------------------------------------------------
    # Recurring accident-condition pattern
    # -------------------------------------------------
    pattern_match = detect_pattern(
        data
    )


    # -------------------------------------------------
    # Rule-based contributing factors
    # -------------------------------------------------
    key_factors = generate_key_factors(
        data
    )


    # -------------------------------------------------
    # Condition-aware safety guidance
    # -------------------------------------------------
    recommendation = generate_recommendation(
        severity_result[
            "predicted_severity"
        ],
        risk_level,
        data,
        risk_index,
    )


    # -------------------------------------------------
    # API response
    # -------------------------------------------------
    return {
        "predicted_severity":
            severity_result[
                "predicted_severity"
            ],

        "confidence":
            severity_result[
                "confidence"
            ],

        "probabilities":
            severity_result[
                "probabilities"
            ],

        "risk_level":
            risk_level,

        "risk_index":
            risk_index,

        "pattern_match":
            pattern_match,

        "key_factors":
            key_factors,

        "shap_factors":
            shap_result.get(
                "factors",
                [],
            ),

        "shap_guidance":
            shap_result.get(
                "guidance",
                [],
            ),

        "recommendation":
            recommendation,
    }