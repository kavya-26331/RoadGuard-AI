import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Clock3,
  CloudRain,
  Lightbulb,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import {
  getAnalyticsSummary,
  getSeverityAnalytics,
  getHourlyAnalytics,
  getTimePeriodAnalytics,
  getDayAnalytics,
  getWeatherAnalytics,
  getLightingAnalytics,
  getCauseAnalytics,
} from "../services/api";


export default function Analytics() {
  const [summary, setSummary] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [timePeriod, setTimePeriod] = useState([]);
  const [day, setDay] = useState([]);
  const [weather, setWeather] = useState([]);
  const [lighting, setLighting] = useState([]);
  const [cause, setCause] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const [
          summaryData,
          severityData,
          hourlyData,
          timePeriodData,
          dayData,
          weatherData,
          lightingData,
          causeData,
        ] = await Promise.all([
          getAnalyticsSummary(),
          getSeverityAnalytics(),
          getHourlyAnalytics(),
          getTimePeriodAnalytics(),
          getDayAnalytics(),
          getWeatherAnalytics(),
          getLightingAnalytics(),
          getCauseAnalytics(),
        ]);

        setSummary(summaryData);
        setSeverity(severityData);
        setHourly(hourlyData);
        setTimePeriod(timePeriodData);
        setDay(dayData);
        setWeather(weatherData);
        setLighting(lightingData);
        setCause(causeData);
      } catch (err) {
        console.error(
          "Analytics loading failed:",
          err
        );

        setError(
          err.response?.data?.detail ||
            err.message ||
            "Unable to load analytics data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);


  const summaryValues = useMemo(() => {
    const row = summary?.[0] || {};

    return {
      totalAccidents: Number(
        row.total_accidents ?? 0
      ),

      severeAccidents: Number(
        row.severe_accidents ?? 0
      ),

      fatalAccidents: Number(
        row.fatal_accidents ?? 0
      ),

      severeRate: Number(
        row.severe_rate ?? 0
      ),
    };
  }, [summary]);


  const severityChart = useMemo(() => {
    return severity.map((item) => ({
      name: item.severity,
      accidents: Number(item.accident_count),
      percentage: Number(item.percentage),
    }));
  }, [severity]);


  const hourlyChart = useMemo(() => {
    return hourly.map((item) => ({
      hour: Number(item.hour),
      accidentCount: Number(item.accident_count),
      severeRate: Number(item.severe_rate),
    }));
  }, [hourly]);


  const timePeriodChart = useMemo(() => {
    return timePeriod.map((item) => ({
      name: item.Time_period,
      accidents: Number(item.accident_count),
      severeRate: Number(item.severe_rate),
    }));
  }, [timePeriod]);


  const dayChart = useMemo(() => {
    return day.map((item) => ({
      name: item.Day_of_week,
      accidents: Number(item.accident_count),
      severeRate: Number(item.severe_rate),
    }));
  }, [day]);


  const weatherChart = useMemo(() => {
    return weather.map((item) => ({
      name: item.Weather_conditions,
      accidents: Number(item.accident_count),
      severeRate: Number(item.severe_rate),
    }));
  }, [weather]);


  const lightingChart = useMemo(() => {
    return lighting.map((item) => ({
      name: item.Light_conditions,
      accidents: Number(item.accident_count),
      severeRate: Number(item.severe_rate),
    }));
  }, [lighting]);


  const causeChart = useMemo(() => {
    return cause
      .map((item) => ({
        name: item.Cause_of_accident,
        accidents: Number(item.accident_count),
        severeRate: Number(item.severe_rate),
      }))
      .sort(
        (a, b) =>
          b.accidents - a.accidents
      );
  }, [cause]);


  if (loading) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">
              Loading RoadGuard AI analytics...
            </p>
          </div>
        </div>
      </main>
    );
  }


  if (error) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Analytics could not be loaded
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Page header */}
        <div className="mb-10">
          

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Road Safety Analytics
          </h2>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Historical accident intelligence across severity,
            time, weather, lighting, days, and recorded causes.
          </p>
        </div>


        {/* KPI cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            icon={BarChart3}
            title="Total Accidents"
            value={formatNumber(
              summaryValues.totalAccidents
            )}
          />

          <MetricCard
            icon={ShieldAlert}
            title="Severe Accidents"
            value={formatNumber(
              summaryValues.severeAccidents
            )}
          />

          <MetricCard
            icon={TrendingUp}
            title="Fatal Accidents"
            value={formatNumber(
              summaryValues.fatalAccidents
            )}
          />

          <MetricCard
            icon={ShieldAlert}
            title="Severe Rate"
            value={`${summaryValues.severeRate.toFixed(2)}%`}
          />

        </div>


        {/* Severity + hourly */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <ChartCard
            title="Accident Severity Distribution"
            subtitle="Historical accident count by severity"
          >
            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <PieChart>
                <Pie
                  data={severityChart}
                  dataKey="accidents"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {severityChart.map(
                    (_, index) => (
                      <Cell
                        key={index}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>


          <ChartCard
            title="Hourly Severe-Outcome Rate"
            subtitle="Observed severe-outcome rate by hour"
          >
            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <LineChart
                data={hourlyChart}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="hour"
                  label={{
                    value: "Hour",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />

                <YAxis
                  label={{
                    value: "Severe Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="severeRate"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  name="Severe Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>


        {/* Time period + day */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <ChartCard
            title="Time Period Analysis"
            subtitle="Observed severe-outcome rate by time period"
          >
            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <BarChart
                data={timePeriodChart}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="severeRate"
                  name="Severe Rate (%)"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>


          <ChartCard
            title="Day of Week"
            subtitle="Observed severe-outcome rate by day"
          >
            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <BarChart data={dayChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="severeRate"
                  name="Severe Rate (%)"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>


        {/* Weather + lighting */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <ChartCard
            icon={CloudRain}
            title="Weather Conditions"
            subtitle="Observed severe-outcome rate by weather"
          >
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={weatherChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="severeRate"
                  name="Severe Rate (%)"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>


          <ChartCard
            icon={Lightbulb}
            title="Lighting Conditions"
            subtitle="Observed severe-outcome rate by lighting"
          >
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={lightingChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  height={90}
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="severeRate"
                  name="Severe Rate (%)"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>


        {/* Accident causes */}
        <div className="mt-6">

          <ChartCard
            title="Accident Causes"
            subtitle="Historical accident count by recorded cause"
          >
            <ResponsiveContainer
              width="100%"
              height={650}
            >
              <BarChart
                data={causeChart}
                layout="vertical"
                margin={{
                  left: 40,
                  right: 30,
                  top: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={220}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="accidents"
                  name="Accidents"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>


        

      </div>
    </main>
  );
}


/* =====================================================
   Components
===================================================== */

function MetricCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={20} />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
      </p>

    </div>
  );
}


function ChartCard({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      {children}

    </div>
  );
}


/* =====================================================
   Helpers
===================================================== */

function formatNumber(value) {
  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}