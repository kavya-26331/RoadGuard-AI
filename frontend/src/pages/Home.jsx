import {
  Brain,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";


function Feature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={20} strokeWidth={2} />
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}


export default function Home({ onStart }) {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">

        {/* Hero */}
        <div className="max-w-3xl">

         


          <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">
            Understand accident risk
            <span className="block text-slate-500">
              before it becomes critical.
            </span>
          </h2>


          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            RoadGuard AI analyzes road, vehicle, environmental,
            and temporal conditions to estimate accident severity,
            assess observed historical risk, and identify
            recurring accident patterns.
          </p>


          <button
            type="button"
            onClick={onStart}
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
          >
            <span>Assess Road Conditions</span>

            
          </button>

        </div>


        {/* Feature cards */}
        <div className="mt-16 grid gap-5 md:mt-20 md:grid-cols-3">

          <Feature
            icon={Brain}
            title="Severity Prediction"
            text="AI-assisted prediction of potential accident severity using road, driver, vehicle, and environmental conditions."
          />

          <Feature
            icon={TrendingUp}
            title="Observed Risk Analysis"
            text="Compare submitted conditions with historical severe-outcome patterns in the accident dataset."
          />

          <Feature
            icon={ShieldCheck}
            title="Pattern Detection"
            text="Identify recurring combinations of accident conditions using the learned pattern-detection model."
          />

        </div>

      </section>
    </main>
  );
}

