# RoadGuard AI

**AI-Powered Road Safety Intelligence & Accident Severity Prediction System**

RoadGuard AI is a full-stack road safety analytics platform that analyzes road, driver, vehicle, environmental, and temporal conditions to predict accident severity and provide interpretable safety insights. The system combines **XGBoost**, **SHAP explainability**, **historical observed severity analysis**, and **DBSCAN-based accident pattern detection** through a modern React and FastAPI application.

## Key Features

* **Accident Severity Prediction** — XGBoost-based classification of:

  * Slight Injury
  * Serious Injury
  * Fatal Injury

* **Model Explainability** — SHAP identifies the features that most influenced each individual prediction.

* **Observed Severity Analysis** — Compares assessment conditions with historical severe-outcome patterns.

* **Pattern Detection** — DBSCAN identifies recurring combinations of accident conditions.

* **Condition-Aware Safety Guidance** — Generates practical guidance based on the submitted road and traffic conditions.

* **Analytics Dashboard** — Provides historical insights across severity, time, day, weather, lighting, and accident causes.

## System Architecture

```text
User Assessment
      │
      ▼
React Frontend
      │
      ▼
FastAPI Backend
      │
      ├── XGBoost Severity Prediction
      │         │
      │         └── SHAP Explanation
      │
      ├── Observed Severity Analysis
      │
      ├── DBSCAN Pattern Detection
      │
      └── Safety Guidance
      │
      ▼
Results & Analytics Dashboard
```

## Machine Learning

### Severity Prediction

A balanced multiclass **XGBoost** model predicts accident severity using road, driver, vehicle, environmental, and temporal features.

The target classes are:

```text
0 → Slight Injury
1 → Serious Injury
2 → Fatal injury
```

Class balancing was applied because the dataset is highly imbalanced toward slight-injury accidents.

### Explainability

**SHAP (SHapley Additive exPlanations)** is used to explain individual predictions by identifying which input features contributed most toward or away from the predicted class.

SHAP explanations describe **model behavior**, not causal relationships.

### Observed Severity Analysis

The system calculates an **Observed Severity Index** by comparing subgroup severe-outcome rates with the overall historical severe-outcome rate.

```text
Observed Severity Index
=
Subgroup Severe Rate
──────────────────────
Overall Severe Rate
```

An index of:

```text
1.0 → historical baseline
>1.0 → higher observed severe-outcome proportion
<1.0 → lower observed severe-outcome proportion
```

This is a historical analytical index, **not an accident probability**.

### Pattern Detection

DBSCAN is applied to combinations of accident conditions such as:

* Time of occurrence
* Day/weekend conditions
* Junction type
* Road surface conditions
* Lighting
* Weather
* Vehicle movement
* Accident cause

Cluster identifiers are used internally and are not exposed to users.

## Dataset

RoadGuard AI uses the **Road Accident Severity in India** dataset containing historical accident records from Indian police departments.

The dataset contains approximately:

* **12,316 accident records**
* **32 original features**
* Records spanning **2017–2022**

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Recharts
* Lucide React

### Backend

* Python
* FastAPI
* Pydantic
* Pandas
* NumPy
* Joblib

### Machine Learning

* XGBoost
* Scikit-learn
* SHAP
* DBSCAN
* PCA
* One-Hot Encoding
* Standard Scaling

## Project Structure

```text
RoadGuard-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   
│
├── ml/
│   ├── data/
│   ├── notebooks/
│   └── models/
│
|
│
|
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

### Prediction

```http
POST /api/v1/predict
```

Returns:

* Predicted severity
* Severity probabilities
* Model confidence
* Observed severity index
* Risk level
* Pattern analysis
* Key contributing factors
* SHAP factors
* SHAP-based guidance
* Safety guidance

### Analytics

```http
GET /api/v1/analytics/summary
GET /api/v1/analytics/severity
GET /api/v1/analytics/hourly
GET /api/v1/analytics/time-period
GET /api/v1/analytics/day
GET /api/v1/analytics/weather
GET /api/v1/analytics/lighting
GET /api/v1/analytics/cause
```

### Health Check

```http
GET /api/v1/health
```

## Local Setup

### Backend

```bash
cd backend

python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run FastAPI:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Model Development Workflow

```text
Raw Dataset
     ↓
Exploratory Data Analysis
     ↓
Data Cleaning
     ↓
Feature Engineering
     ↓
XGBoost Training
     ↓
Model Evaluation
     ↓
SHAP Analysis
     ↓
Historical Risk Analysis
     ↓
DBSCAN Pattern Detection
     ↓
Model Artifacts
     ↓
FastAPI Inference
     ↓
React Dashboard
```

## Important Limitations

RoadGuard AI should be interpreted within the limitations of the underlying dataset and methodology.

* The dataset contains **accident records**, not exposure or non-accident observations. Therefore, the system does not estimate a true probability of an accident occurring.
* The **Observed Severity Index** measures historical severe-outcome patterns and should not be interpreted as an accident probability.
* The dataset does not provide latitude/longitude information, so DBSCAN identifies **recurring accident-condition patterns**, not geographic hotspots.
* SHAP explains the model's learned behavior and should not be interpreted as evidence of causation.
* Model performance for minority classes, particularly fatal injuries, is limited by the small number of fatal examples.

## Purpose

RoadGuard AI is designed as a **decision-support and analytical system** for exploring historical road accident patterns, understanding machine-learning predictions, and communicating condition-aware safety insights.

It is not intended to replace professional traffic engineering, emergency response, or road-safety decision-making.

## License

This project is intended for educational, research, and portfolio purposes. Add the project's chosen license details here.
