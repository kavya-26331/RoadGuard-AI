export default function Results({ result, onBack }) {
  if (!result) {
    return null;
  }

  const riskClass =
    result.risk_level === "High"
      ? "border-red-200 bg-red-50 text-red-700"
      : result.risk_level === "Moderate"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const probabilities = result.probabilities || {};

  const shapFactors = result.shap_factors || [];

  const shapGuidance = result.shap_guidance || [];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span className="text-lg">←</span>
          <span>Make New Predictions</span>
        </button>


        {/* Page header */}
        <div className="mb-8">
          

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            ROADGUARD AI ANALYSIS
          </h2>

         
        </div>


        {/* Top metrics */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Overall Risk */}
          <div
            className={`rounded-2xl border p-6 ${riskClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-current" />

              <p className="text-sm font-semibold">
                Overall Risk
              </p>
            </div>

            <p className="mt-8 text-4xl font-bold">
              {result.risk_level}
            </p>

            <p className="mt-2 text-sm opacity-80">
              Based on observed historical accident
              severity patterns.
            </p>
          </div>


          {/* Predicted Severity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />

              <p className="text-sm font-medium text-slate-500">
                Predicted Severity
              </p>
            </div>

            <p className="mt-8 text-3xl font-bold text-slate-950">
              {result.predicted_severity}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Based on the trained XGBoost severity model.
            </p>
          </div>


          {/* Model Confidence */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />

              <p className="text-sm font-medium text-slate-500">
                Model Confidence
              </p>
            </div>

            <p className="mt-8 text-3xl font-bold text-slate-950">
              {Number(result.confidence || 0).toFixed(2)}%
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Probability assigned to the predicted class.
            </p>
          </div>

        </div>


        {/* Severity probabilities */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Severity Probability
            </h3>

            
          </div>

          <div className="space-y-5">

            <ProbabilityBar
              label="Slight Injury"
              value={probabilities["Slight Injury"] || 0}
              predicted={
                result.predicted_severity === "Slight Injury"
              }
            />

            <ProbabilityBar
              label="Serious Injury"
              value={probabilities["Serious Injury"] || 0}
              predicted={
                result.predicted_severity === "Serious Injury"
              }
            />

            <ProbabilityBar
              label="Fatal injury"
              value={probabilities["Fatal injury"] || 0}
              predicted={
                result.predicted_severity === "Fatal injury"
              }
            />

          </div>

        </section>


        {/* Observed severity + pattern */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Observed Severity Index */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-slate-900">
              Observed Severity Index
            </h3>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-5xl font-bold text-slate-950">
                {Number(result.risk_index || 0).toFixed(2)}
              </span>

              <span className="pb-2 text-slate-500">
                × historical baseline
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              A value of 1.0 represents the overall observed
              severe-outcome rate in the historical dataset.
            </p>

          </section>


          {/* Pattern Analysis */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-slate-900">
              Pattern Analysis
            </h3>

            <div className="mt-5 flex items-start gap-3">
              <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-600" />

              <p className="leading-7 text-slate-600">
                {result.pattern_match}
              </p>
            </div>

          </section>

        </div>


        {/* SHAP explanation */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Model Predictions using Shap
            </h3>

           
          </div>

          {shapFactors.length > 0 ? (
            <div className="space-y-4">

              {shapFactors.map((factor, index) => (
                <ShapRow
                  key={`${factor.feature}-${index}`}
                  factor={factor}
                />
              ))}

            </div>
          ) : (
            <p className="text-sm text-slate-400">
              SHAP explanation is not available for this prediction.
            </p>
          )}

        </section>


        {/* Key contributing factors */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Key Contributing Factors
          </h3>

          <div className="mt-5 grid gap-3 md:grid-cols-2">

            {result.key_factors?.map((factor, index) => (
              <div
                key={`${factor}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {factor}
              </div>
            ))}

          </div>

        </section>


        {/* SHAP-based safety guidance */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Safety Guidlines
            </h3>

            
          </div>

          {shapGuidance.length > 0 ? (
            <div className="space-y-3">

              {shapGuidance.map((guidance, index) => (
                <div
                  key={`${guidance}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {guidance}
                </div>
              ))}

            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {result.recommendation}
            </p>
          )}

        </section>


        {/* Disclaimer */}
        

      </div>
    </main>
  );
}


/* =====================================================
   Probability Bar
===================================================== */

function ProbabilityBar({
  label,
  value,
  predicted,
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            {label}
          </span>

          {predicted && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              Predicted
            </span>
          )}
        </div>

        <span className="text-sm font-semibold text-slate-900">
          {safeValue.toFixed(2)}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            predicted
              ? "bg-slate-900"
              : "bg-slate-400"
          }`}
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>

    </div>
  );
}


/* =====================================================
   SHAP Row
===================================================== */

function ShapRow({
  factor,
}) {
  const contribution =
    Number(factor.contribution) || 0;

  const isPositive =
    contribution >= 0;

  const magnitude = Math.min(
    100,
    Math.abs(contribution) * 100
  );

  return (
    <div className="rounded-xl border border-slate-200 p-4">

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="font-medium text-slate-800">
            {factor.label}
          </p>

          {factor.value && (
            <p className="mt-1 text-xs text-slate-500">
              Input: {factor.value}
            </p>
          )}
        </div>

        <div
          className={`text-sm font-semibold ${
            isPositive
              ? "text-slate-900"
              : "text-slate-500"
          }`}
        >
          {contribution >= 0 ? "+" : ""}
          {contribution.toFixed(4)}
        </div>

      </div>


      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isPositive
              ? "bg-slate-800"
              : "bg-slate-400"
          }`}
          style={{
            width: `${Math.max(
              magnitude,
              4
            )}%`,
          }}
        />

      </div>


      <p className="mt-2 text-xs text-slate-500">
        Model contribution:{" "}
        {isPositive
          ? "toward the predicted class"
          : "away from the predicted class"}
      </p>

    </div>
  );
}