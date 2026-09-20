import { useState } from "react";

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function Select({ name, options }) {
  return (
    <select
      name={name}
      className="select-field"
      defaultValue={options[0]}
      required
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function NumberInput({ name, min, max, defaultValue }) {
  return (
    <input
      type="number"
      name={name}
      min={min}
      max={max}
      defaultValue={defaultValue}
      className="input-field"
      required
    />
  );
}

export default function Assessment({ onSubmit, loading }) {
  const [hour, setHour] = useState(12);

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const data = {
      day_of_week: form.get("day_of_week"),
      age_band_of_driver: form.get("age_band_of_driver"),
      sex_of_driver: form.get("sex_of_driver"),

      educational_level: form.get("educational_level"),
      driving_experience: form.get("driving_experience"),

      type_of_vehicle: form.get("type_of_vehicle"),

      area_accident_occured: form.get(
        "area_accident_occured"
      ),

      lanes_or_medians: form.get("lanes_or_medians"),

      road_allignment: form.get("road_allignment"),

      types_of_junction: form.get(
        "types_of_junction"
      ),

      road_surface_type: form.get(
        "road_surface_type"
      ),

      road_surface_conditions: form.get(
        "road_surface_conditions"
      ),

      light_conditions: form.get(
        "light_conditions"
      ),

      weather_conditions: form.get(
        "weather_conditions"
      ),

      type_of_collision: form.get(
        "type_of_collision"
      ),

      vehicle_movement: form.get(
        "vehicle_movement"
      ),

      cause_of_accident: form.get(
        "cause_of_accident"
      ),

      hour: Number(form.get("hour")),
      minute: Number(form.get("minute")),
    };

    console.log("Form data:", data);

    onSubmit(data);
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
         

         

          
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* TIME & DRIVER */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Time & Driver
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Basic temporal and driver characteristics.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <Field label="Day of Week">
                  <Select
                    name="day_of_week"
                    options={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ]}
                  />
                </Field>

                <Field label="Driver Age Group">
                  <Select
                    name="age_band_of_driver"
                    options={[
                      "18-30",
                      "31-50",
                      "Over 51",
                      "Under 18",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Sex of Driver">
                  <Select
                    name="sex_of_driver"
                    options={[
                      "Male",
                      "Female",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Educational Level">
                  <Select
                    name="educational_level"
                    options={[
                      "High school",
                      "Junior high school",
                      "Elementary school",
                      "Above high school",
                      "Writing & reading",
                      "Illiterate",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Driving Experience">
                  <Select
                    name="driving_experience"
                    options={[
                      "1-2yr",
                      "2-5yr",
                      "5-10yr",
                      "Above 10yr",
                      "Below 1yr",
                      "No Licence",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Hour">
                  <NumberInput
                    name="hour"
                    min={0}
                    max={23}
                    defaultValue={12}
                  />
                </Field>

                <Field label="Minute">
                  <NumberInput
                    name="minute"
                    min={0}
                    max={59}
                    defaultValue={0}
                  />
                </Field>

              </div>
            </section>

            {/* ROAD ENVIRONMENT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Road Environment
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Road layout, junction, surface, and location
                  characteristics.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <Field label="Area">
                  <Select
                    name="area_accident_occured"
                    options={[
                      "Residential areas",
                      "Office areas",
                      "Industrial areas",
                      "Other",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Lanes / Medians">
                  <Select
                    name="lanes_or_medians"
                    options={[
                      "Two-way (divided with broken lines road marking)",
                      "Two-way (divided with solid lines road marking)",
                      "Undivided Two way",
                      "One way",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Road Alignment">
                  <Select
                    name="road_allignment"
                    options={[
                      "Straight Road",
                      "Gentle horizontal curve",
                      "Steep slope",
                      "Sharp reverse curve",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Junction Type">
                  <Select
                    name="types_of_junction"
                    options={[
                      "No junction",
                      "Y Shape",
                      "Crossing",
                      "O Shape",
                      "T Shape",
                      "X Shape",
                      "Other",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Road Surface Type">
                  <Select
                    name="road_surface_type"
                    options={[
                      "Asphalt roads",
                      "Earth roads",
                      "Gravel roads",
                      "Asphalt",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Road Surface Conditions">
                  <Select
                    name="road_surface_conditions"
                    options={[
                      "Dry",
                      "Wet or damp",
                      "Flood over 3cm. deep",
                      "Snow",
                      "Unknown",
                    ]}
                  />
                </Field>

              </div>
            </section>

            {/* WEATHER & TRAFFIC */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Weather & Traffic
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Visibility, weather, vehicle movement, and
                  accident characteristics.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <Field label="Light Conditions">
                  <Select
                    name="light_conditions"
                    options={[
                      "Daylight",
                      "Darkness - lights lit",
                      "Darkness - no lighting",
                      "Darkness - lights unlit",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Weather Conditions">
                  <Select
                    name="weather_conditions"
                    options={[
                      "Normal",
                      "Raining",
                      "Raining and Windy",
                      "Cloudy",
                      "Windy",
                      "Fog or mist",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Vehicle Movement">
                  <Select
                    name="vehicle_movement"
                    options={[
                      "Going straight",
                      "Turning right",
                      "Turning left",
                      "U-Turn",
                      "Overtaking",
                      "Changing lane to the left",
                      "Changing lane to the right",
                      "Moving Backward",
                      "Parked",
                      "Stopping",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Type of Vehicle">
                  <Select
                    name="type_of_vehicle"
                    options={[
                      "Automobile",
                      "Lorry",
                      "Pick up upto 10Q",
                      "Public (> 45 seats)",
                      "Public (13-45 seats)",
                      "Public (12 seats)",
                      "Taxi",
                      "Motorcycle",
                      "Bajaj",
                      "Stationwagen",
                      "Ridden horse",
                      "Other",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Type of Collision">
                  <Select
                    name="type_of_collision"
                    options={[
                      "Collision with roadside objects",
                      "Collision with pedestrians",
                      "Collision with animals",
                      "Collision with vehicles",
                      "Vehicle with vehicle collision",
                      "Overturning",
                      "Fall from vehicles",
                      "Unknown",
                    ]}
                  />
                </Field>

                <Field label="Cause of Accident">
                  <Select
                    name="cause_of_accident"
                    options={[
                      "No distancing",
                      "Changing lane to the right",
                      "Changing lane to the left",
                      "Driving carelessly",
                      "No priority to vehicle",
                      "Moving Backward",
                      "No priority to pedestrian",
                      "Overtaking",
                      "Driving to left",
                      "High speed",
                      "DUI",
                      "Other",
                      "Unknown",
                    ]}
                  />
                </Field>

              </div>
            </section>

            <div className="flex justify-end">
              <button
              type="submit"
              disabled={loading}
              className="min-w-[220px] rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
  >
            {loading ? "Analyzing..." : "Predict"}
            </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}