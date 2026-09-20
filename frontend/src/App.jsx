import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Analytics from "./pages/Analytics";

import { assessRisk } from "./services/api";


function App() {
  const [page, setPage] = useState("home");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  function startAssessment() {
    setError("");
    setPage("assessment");
  }


  function goHome() {
    setError("");
    setResult(null);
    setPage("home");
  }


  function goBackToAssessment() {
    setError("");
    setPage("assessment");
  }


  function openAnalytics() {
    console.log("Opening Analytics page");
    setError("");
    setPage("analytics");
  }


  async function handleAssessment(formData) {
    setLoading(true);
    setError("");

    try {
      console.log(
        "Sending assessment to backend:",
        formData
      );

      const response = await assessRisk(formData);

      console.log(
        "RoadGuard backend response:",
        response
      );

      setResult(response);
      setPage("results");
    } catch (err) {
      console.error(
        "Assessment failed:",
        err
      );

      setError(
        err.message ||
          "Unable to analyze the entered road conditions."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="app-shell min-h-screen bg-slate-50">

      <Navbar
        onHome={goHome}
        onAnalytics={openAnalytics}
      />

      {error && (
        <div className="mx-auto mt-4 max-w-7xl px-6">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}


      {page === "home" && (
        <Home
          onStart={startAssessment}
        />
      )}


      {page === "assessment" && (
        <Assessment
          onSubmit={handleAssessment}
          loading={loading}
        />
      )}


      {page === "results" && result && (
        <Results
          result={result}
          onBack={goBackToAssessment}
        />
      )}


      {page === "analytics" && (
        <Analytics />
      )}

    </div>
  );
}


export default App;