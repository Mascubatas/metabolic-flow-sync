import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Check,
  Droplets,
  Dumbbell,
  Footprints,
  Minus,
  Pill,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Ring } from "@/components/Ring";
import { WeeklyCheckIn } from "@/components/WeeklyCheckIn";
import { useStore, useTotals } from "@/lib/store";
import { daysBetween, recoveryScore, todayKey } from "@/lib/calc";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Metabolix Metabolic & Fitness Tracker" },
      {
        name: "description",
        content:
          "Your daily rings for calories, macros, hydration and habits, with adaptive reminders and a 50-day blood work countdown.",
      },
      { property: "og:title", content: "Today — Metabolix Metabolic & Fitness Tracker" },
      {
        property: "og:description",
        content: "Daily calories, macros, hydration and habit tracking in one adaptive dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const HABITS = [
  { id: "workout", label: "Complete scheduled workout", icon: Dumbbell },
  { id: "walk", label: "Post-meal walk / stairs", icon: Footprints },
  { id: "sleep", label: "7+ hours sleep last night", icon: Sparkles },
];

function Dashboard() {
  const { hydrated, state, today, updateDay } = useStore();
  const totals = useTotals();
  const [lastReminder, setLastReminder] = useState(0);

  const plan = state.plan;
  const waterMl = today.water * 250;
  const waterPct = plan ? Math.min(1, waterMl / plan.water) : 0;

  const daysLeft = plan ? daysBetween(todayKey(), plan.bloodworkDate) : 0;

  const recovery = useMemo(() => {
    const d = state.wearable.days[0];
    return d ? recoveryScore(d.sleep, d.hrv, d.restingHr) : null;
  }, [state.wearable.days]);

  useEffect(() => {
    if (!plan || !state.settings.waterReminders) return;
    const ms = state.settings.reminderInterval * 60 * 1000;
    const id = setInterval(() => {
      if (waterMl < plan.water) {
        setLastReminder(Date.now());
        toast("Hydration check", { description: "Time for a glass of water (250 mL)." });
      }
    }, ms);
    return () => clearInterval(id);
  }, [plan, state.settings.waterReminders, state.settings.reminderInterval, waterMl]);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-muted/50" />;
  }

  if (!plan || !state.profile) {
    return (
      <div className="panel glow-primary mx-auto max-w-xl space-y-4 p-7 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Activity className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold">Build your metabolic plan</h1>
        <p className="text-sm text-muted-foreground">
          A short screening covering biometrics, health conditions, joint health, medications and
          optional blood markers generates your calorie, hydration and training targets.
        </p>
        <Button asChild className="w-full">
          <Link to="/onboarding">
            Start screening <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const profile = state.profile;
  const meds = profile.medications.filter((m) => {
    if (m.schedule !== "alternate") return true;
    return daysBetween(profile.startDate, todayKey()) % 2 === 0;
  });

  const remaining = Math.max(0, plan.calories - totals.calories);

  return (
    <div className="space-y-5">
      <WeeklyCheckIn />

      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">
            Hi {profile.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            {remaining} kcal left · {profile.weight} kg → {profile.targetWeight} kg
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-right">
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarClock className="h-3 w-3" /> Blood work
          </p>
          <p className="font-display text-lg font-bold text-primary">{daysLeft}d</p>
        </div>
      </header>

      <section className="panel p-5">
        <div className="no-scrollbar flex justify-between gap-4 overflow-x-auto">
          <Ring value={totals.calories} max={plan.calories} label="Calories" sub="kcal" />
          <Ring
            value={totals.protein}
            max={plan.protein}
            label="Protein"
            sub="g"
            color="var(--protein)"
          />
          <Ring value={totals.carbs} max={plan.carbs} label="Carbs" sub="g" color="var(--carb)" />
          <Ring value={totals.fat} max={plan.fat} label="Fat" sub="g" color="var(--fat)" />
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div
          className="relative p-5"
          style={{
            background: `linear-gradient(to top, color-mix(in oklab, var(--hydro) 28%, transparent) ${waterPct * 100}%, transparent ${waterPct * 100}%)`,
            transition: "background 500ms ease",
          }}
        >
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-hydro" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Hydration</h2>
            <span className="ml-auto font-display text-lg font-bold">
              {(waterMl / 1000).toFixed(2)} / {(plan.water / 1000).toFixed(1)} L
            </span>
          </div>

          <div className="mt-4 grid grid-cols-8 gap-2">
            {Array.from({ length: Math.ceil(plan.water / 250) }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Glass ${i + 1}`}
                onClick={() => updateDay((d) => ({ ...d, water: i + 1 === d.water ? i : i + 1 }))}
                className={`aspect-2/3 rounded-md border transition-all ${
                  i < today.water
                    ? "border-hydro bg-hydro/70 shadow-[0_0_12px_-2px_var(--hydro)]"
                    : "border-border bg-secondary/50"
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                updateDay((d) => ({ ...d, water: d.water + 1 }));
                toast.success("Glass logged", { description: "+250 mL" });
              }}
            >
              <Droplets className="mr-1 h-4 w-4" /> Add glass (250 mL)
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Remove glass"
              onClick={() => updateDay((d) => ({ ...d, water: Math.max(0, d.water - 1) }))}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          {state.settings.waterReminders && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Reminders every {state.settings.reminderInterval} min while you are behind target
              {lastReminder ? " · last nudge sent" : ""}.
            </p>
          )}
        </div>
      </section>

      <section className="panel space-y-3 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Daily habits</h2>
        {HABITS.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() =>
              updateDay((d) => ({ ...d, habits: { ...d.habits, [h.id]: !d.habits[h.id] } }))
            }
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-3 text-left text-sm"
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                today.habits[h.id]
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border"
              }`}
            >
              {today.habits[h.id] ? <Check className="h-4 w-4" /> : null}
            </span>
            <h.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className={today.habits[h.id] ? "line-through opacity-60" : ""}>{h.label}</span>
          </button>
        ))}

        {meds.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Pill className="h-3.5 w-3.5" /> Medication today
            </p>
            {meds.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  updateDay((d) => ({ ...d, meds: { ...d.meds, [m.id]: !d.meds[m.id] } }))
                }
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left text-sm"
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                    today.meds[m.id]
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {today.meds[m.id] ? <Check className="h-4 w-4" /> : null}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {m.name} <span className="text-muted-foreground">{m.dose}</span>
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{m.timeOfDay}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {recovery !== null && (
        <section className="panel flex items-center gap-4 p-5">
          <Ring value={recovery} max={100} label="Recovery" sub="readiness" color="var(--accent)" size={92} />
          <div className="min-w-0 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {recovery >= 75 ? "Green light" : recovery >= 55 ? "Moderate" : "Back off today"}
            </p>
            <p className="mt-1">
              {recovery >= 75
                ? "Full training volume is appropriate."
                : recovery >= 55
                  ? "Keep intensity, trim one set per exercise."
                  : "Swap to zone 2 cardio or mobility and prioritise sleep."}
            </p>
          </div>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild variant="secondary" className="h-12 justify-between">
          <Link to="/training">
            Today&apos;s workout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary" className="h-12 justify-between">
          <Link to="/nutrition">
            Log food &amp; drinks <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
