from fastapi import APIRouter, HTTPException

import pandas as pd

from app.config import (
    SUMMARY_PATH,
    SEVERITY_SUMMARY_PATH,
    HOURLY_SUMMARY_PATH,
    TIME_PERIOD_SUMMARY_PATH,
    DAY_SUMMARY_PATH,
    WEATHER_SUMMARY_PATH,
    LIGHTING_SUMMARY_PATH,
    CAUSE_SUMMARY_PATH,
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


def read_csv(path):
    """
    Load an analytics CSV file and return it as a DataFrame.
    """

    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Analytics file not found: {path.name}",
        )

    try:
        return pd.read_csv(path)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to read analytics file: {path.name}",
        ) from exc


def dataframe_response(df):
    """
    Convert DataFrame to JSON-safe records.
    """

    # Convert NaN/NaT values to None so the API returns
    # valid JSON values.
    df = df.where(pd.notnull(df), None)

    return df.to_dict(
        orient="records"
    )


@router.get("/summary")
def summary():
    df = read_csv(SUMMARY_PATH)

    return dataframe_response(df)


@router.get("/severity")
def severity():
    df = read_csv(
        SEVERITY_SUMMARY_PATH
    )

    return dataframe_response(df)


@router.get("/hourly")
def hourly():
    df = read_csv(
        HOURLY_SUMMARY_PATH
    )

    return dataframe_response(df)


@router.get("/time-period")
def time_period():
    df = read_csv(
        TIME_PERIOD_SUMMARY_PATH
    )

    return dataframe_response(df)


@router.get("/day")
def day():
    df = read_csv(
        DAY_SUMMARY_PATH
    )

    return dataframe_response(df)


@router.get("/weather")
def weather():
    df = read_csv(
        WEATHER_SUMMARY_PATH
    )

    return dataframe_response(df)


@router.get("/lighting")
def lighting():
    df = read_csv(
        LIGHTING_SUMMARY_PATH
    )

    return dataframe_response(df)


@router.get("/cause")
def cause():
    df = read_csv(
        CAUSE_SUMMARY_PATH
    )

    return dataframe_response(df)