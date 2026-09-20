import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


// =====================================================
// Prediction
// =====================================================

async function assessRisk(data) {
  try {
    const response = await API.post(
      "/api/v1/predict",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "RoadGuard API error:",
      error
    );

    if (error.response) {
      throw new Error(
        error.response.data?.detail ||
          `Backend error: ${error.response.status}`
      );
    }

    throw new Error(
      "Unable to connect to RoadGuard AI backend."
    );
  }
}


// =====================================================
// Analytics
// =====================================================

async function getAnalyticsSummary() {
  const response = await API.get(
    "/api/v1/analytics/summary"
  );

  return response.data;
}


async function getSeverityAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/severity"
  );

  return response.data;
}


async function getHourlyAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/hourly"
  );

  return response.data;
}


async function getTimePeriodAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/time-period"
  );

  return response.data;
}


async function getDayAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/day"
  );

  return response.data;
}


async function getWeatherAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/weather"
  );

  return response.data;
}


async function getLightingAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/lighting"
  );

  return response.data;
}


async function getCauseAnalytics() {
  const response = await API.get(
    "/api/v1/analytics/cause"
  );

  return response.data;
}


// =====================================================
// Named exports
// =====================================================

export {
  assessRisk,
  getAnalyticsSummary,
  getSeverityAnalytics,
  getHourlyAnalytics,
  getTimePeriodAnalytics,
  getDayAnalytics,
  getWeatherAnalytics,
  getLightingAnalytics,
  getCauseAnalytics,
};


// =====================================================
// Default export
// =====================================================

export default API;
