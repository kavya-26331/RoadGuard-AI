def determine_risk_level(risk_index: float) -> str:
    if risk_index >= 1.30:
        return "High"

    if risk_index >= 0.90:
        return "Moderate"

    return "Low"


def generate_key_factors(data: dict) -> list[str]:
    factors = []

    hour = int(data["hour"])

    # -------------------------------------------------
    # Time
    # -------------------------------------------------

    if hour < 6 or hour >= 18:
        factors.append(
            "Night-time conditions"
        )

    # -------------------------------------------------
    # Weather
    # -------------------------------------------------

    weather = (
        data["weather_conditions"]
        .strip()
        .lower()
    )

    if weather != "normal":
        factors.append(
            "Weather conditions"
        )

    # -------------------------------------------------
    # Road surface
    # -------------------------------------------------

    surface = (
        data["road_surface_conditions"]
        .strip()
        .lower()
    )

    if surface != "dry":
        factors.append(
            "Road surface conditions"
        )

    # -------------------------------------------------
    # Lighting
    # -------------------------------------------------

    lighting = (
        data["light_conditions"]
        .strip()
        .lower()
    )

    if "darkness" in lighting:
        factors.append(
            "Lighting conditions"
        )

    # -------------------------------------------------
    # Junction
    # -------------------------------------------------

    junction = (
        data["types_of_junction"]
        .strip()
        .lower()
    )

    if junction != "no junction":
        factors.append(
            "Junction and road configuration"
        )

    # -------------------------------------------------
    # Vehicle movement
    # -------------------------------------------------

    movement = (
        data["vehicle_movement"]
        .strip()
    )

    if movement:
        factors.append(
            f"Vehicle movement: {movement}"
        )

    # -------------------------------------------------
    # Accident cause
    # -------------------------------------------------

    cause = (
        data["cause_of_accident"]
        .strip()
    )

    if cause:
        factors.append(
            f"Accident cause: {cause}"
        )

    # -------------------------------------------------
    # Driver experience
    # -------------------------------------------------

    if len(factors) < 3:
        experience = (
            data["driving_experience"]
            .strip()
        )

        if experience:
            factors.append(
                f"Driving experience: {experience}"
            )

    # -------------------------------------------------
    # Driver age
    # -------------------------------------------------

    if len(factors) < 3:
        age_group = (
            data["age_band_of_driver"]
            .strip()
        )

        if age_group:
            factors.append(
                f"Driver age group: {age_group}"
            )

    # Always give at least one factor
    if not factors:
        factors.append(
            "Entered road and traffic conditions"
        )

    return factors[:5]


def generate_recommendation(
    severity: str,
    risk_level: str,
    data: dict,
    risk_index: float,
) -> str:
    """
    Generate condition-aware safety guidance.

    This function does not change the ML prediction.
    It only converts the assessment conditions into
    practical explanatory guidance.
    """

    recommendations = []

    hour = int(data["hour"])

    weather = (
        data["weather_conditions"]
        .strip()
        .lower()
    )

    surface = (
        data["road_surface_conditions"]
        .strip()
        .lower()
    )

    lighting = (
        data["light_conditions"]
        .strip()
        .lower()
    )

    movement = (
        data["vehicle_movement"]
        .strip()
        .lower()
    )

    cause = (
        data["cause_of_accident"]
        .strip()
        .lower()
    )

    junction = (
        data["types_of_junction"]
        .strip()
        .lower()
    )

    # -------------------------------------------------
    # Severity / overall risk
    # -------------------------------------------------

    if severity == "Fatal injury":
        recommendations.append(
            "Use maximum caution under these conditions."
        )

    elif severity == "Serious Injury":
        recommendations.append(
            "Exercise additional caution under these conditions."
        )

    elif risk_level == "High":
        recommendations.append(
            "Exercise a high level of caution under these conditions."
        )

    elif risk_level == "Moderate":
        recommendations.append(
            "Remain alert and maintain a controlled speed."
        )

    else:
        recommendations.append(
            "Continue following safe driving practices."
        )

    # -------------------------------------------------
    # Night-time
    # -------------------------------------------------

    if hour < 6 or hour >= 18:
        recommendations.append(
            "Use extra care during reduced-visibility night-time conditions."
        )

    # -------------------------------------------------
    # Lighting
    # -------------------------------------------------

    if "darkness" in lighting:
        recommendations.append(
            "Use appropriate vehicle lighting and maintain clear visibility."
        )

    # -------------------------------------------------
    # Weather
    # -------------------------------------------------

    if weather != "normal":
        recommendations.append(
            "Adjust speed and following distance to the current weather conditions."
        )

    # -------------------------------------------------
    # Road surface
    # -------------------------------------------------

    if surface != "dry":
        recommendations.append(
            "Allow additional stopping distance on the current road surface."
        )

    # -------------------------------------------------
    # Vehicle movement
    # -------------------------------------------------

    if movement in {
        "overtaking",
        "changing lane to the left",
        "changing lane to the right",
        "u-turn",
    }:
        recommendations.append(
            "Check surrounding traffic carefully before changing position or direction."
        )

    elif movement == "moving backward":
        recommendations.append(
            "Check the area behind the vehicle carefully before reversing."
        )

    elif movement == "turning left":
        recommendations.append(
            "Reduce speed and check surrounding traffic before turning."
        )

    elif movement == "turning right":
        recommendations.append(
            "Reduce speed and verify the path is clear before turning."
        )

    # -------------------------------------------------
    # Accident cause
    # -------------------------------------------------

    if "high speed" in cause:
        recommendations.append(
            "Reduce speed and maintain a speed appropriate for the road conditions."
        )

    elif "no distancing" in cause:
        recommendations.append(
            "Increase following distance from the vehicle ahead."
        )

    elif "overtaking" in cause:
        recommendations.append(
            "Avoid unnecessary overtaking and verify sufficient visibility before passing."
        )

    elif "driving carelessly" in cause:
        recommendations.append(
            "Maintain focused attention and avoid unnecessary distractions."
        )

    elif "dui" in cause:
        recommendations.append(
            "Do not drive while impaired and use a safe alternative."
        )

    elif "moving backward" in cause:
        recommendations.append(
            "Check for vehicles and pedestrians before moving backward."
        )

    # -------------------------------------------------
    # Junction
    # -------------------------------------------------

    if junction != "no junction":
        recommendations.append(
            "Approach the junction carefully and watch for conflicting traffic."
        )

    # -------------------------------------------------
    # Fallback
    # -------------------------------------------------

    if len(recommendations) == 1:
        recommendations.append(
            "Maintain sufficient following distance and remain alert to changing road conditions."
        )

    # Keep the displayed recommendation concise.
    return " ".join(recommendations[:3])