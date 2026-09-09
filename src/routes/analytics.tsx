import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { addDays, recoveryScore, todayKey } from "@/lib/calc";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { BiomarkerEntry } from "@/lib/types";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Trends — Weight, Hydration & Biomarker Analytics | Metabolix" },
      {
        name: "description",
        content:
          "Track weight trends, hydration consistency, workout adherence and blood marker comparisons over time.",
      },
      { property: "og:title", content: "Trends — Weight, Hydration & Biomarkers" },
      {
        property: "og:description",
        content:
          "Interactive charts for weight, hydration, adherence and lab work, plus wearable recovery data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

const LAB_FIELDS: { key: keyof BiomarkerEntry; label: string }[] = [
  { key: "hba1c", label: "HbA1c (%)" },
  { key: "glucose", label: "Fasting glucose (mg/dL)" },
  { key: "insulin", label: "Fasting insulin (µIU/mL)" },
  { key: "ldl", label: "LDL (mg/dL)" },
  { key: "hdl", label: "HDL (mg/dL)" },
  { key: "triglycerides", label: "Triglycerides (mg/dL)" },
  { key: "egfr", label: "eGFR" },
  { key: "urea", label: "Urea" },
  { key: "uricAcid", label: "Uric acid" },
];

function AnalyticsPage() {
  const { hydrated, state, update, setSettings, reset } = useStore();
  const [labs, setLabs] = useState<Record<string, string>>({});
  const { plan, profile } = state;

  const last14 = useMemo(() => {
    const out: string[] = [];
    for (let i = 13; i >= 0; i--) out.push(addDays(todayKey(), -i));
    return out;
  }, []);

  const weightData = last14.map((d) => ({
    date: d.slice(5),
    weight: state.days[d]?.weight ?? null,
  }));

  const hydrationData = last14.map((d) => ({
    date: d.slice(5),
    liters: ((state.days[d]?.water ?? 0) * 250) / 1000,
    target: plan ? plan.water / 1000 : 0,
  }));

  const adherenceData = last14.map((d) => {
    const w = state.workouts[d];
    return { date: d.slice(5), done: w?.status === "done" ? 1 : w?.status === "replaced" ? 0.5 : 0 };
  });

  const checkInData = [...state.checkIns]
    .reverse()
    .map((c) => ({ date: c.date.slice(5), pain: c.tendonPain, energy: c.energy, sleep: c.sleep }));

  const labsSorted = [...state.labs].sort((a, b) => a.date.localeCompare(b.date));

  const wearableData = state.wearable.days.slice(-14).map((d) => ({
    date: d.date.slice(5),
    sleep: d.sleep,
    hrv: d.hrv,
    recovery: recoveryScore(d.sleep, d.hrv, d.restingHr),
  }));

  if (!hydrated) return null;
  if (!plan || !profile) {
    return (
      <div className="panel p-6 text-center">
        <p className="text-sm text-muted-foreground">Create your plan first.</p>
        <Button asChild className="mt-4">
          <Link to="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    );
  }

  function saveLabs() {
    const entry: BiomarkerEntry = { date: todayKey() };
    let any = false;
    for (const f of LAB_FIELDS) {
      const v = Number(labs[f.key as string]);
      if (labs[f.key as string] && !Number.isNaN(v)) {
        (entry as Record<string, unknown>)[f.key as string] = v;
        any = true;
      }
    }
    if (!any) {
      toast.error("Enter at least one marker");
      return;
    }
    update((s) => ({ ...s, labs: [entry, ...s.labs] }));
    setLabs({});
    toast.success("Blood work saved");
  }

  function connectWearable() {
    const days = last14.map((d, i) => ({
      date: d,
      sleep: Number((6.2 + Math.sin(i / 2) * 1.1).toFixed(1)),
      hrv: Math.round(52 + Math.cos(i / 3) * 12),
      restingHr: Math.round(58 - Math.sin(i / 4) * 4),
      steps: Math.round(7000 + Math.cos(i) * 2500),
    }));
    update((s) => ({ ...s, wearable: { connected: true, provider: "Health sync", days } }));
    toast.success("Wearable connected — sleep and HRV imported");
  }

  return (
    <div className="space-y-6 pb-24">
      <section className="panel p-5">
        <h1 className="font-display text-2xl font-bold">Trends</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Next blood work {plan.bloodworkDate} · start weight {profile.weight} kg · target{" "}
          {profile.targetWeight} kg
        </p>
      </section>

      <ChartCard title="Weight trend (14 days)">
        <LineChart data={weightData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <YAxis domain={["auto", "auto"]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            connectNulls
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartCard>

      <ChartCard title="Hydration (L per day)">
        <ComposedChart data={hydrationData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="liters" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="target" stroke="hsl(var(--accent))" dot={false} />
        </ComposedChart>
      </ChartCard>

      <ChartCard title="Workout adherence">
        <BarChart data={adherenceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <YAxis domain={[0, 1]} ticks={[0, 0.5, 1]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="done" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      {checkInData.length > 0 && (
        <ChartCard title="Symptom check-ins">
          <LineChart data={checkInData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
            <YAxis domain={[0, 10]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="pain" stroke="hsl(var(--destructive))" strokeWidth={2} />
            <Line type="monotone" dataKey="energy" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="sleep" stroke="hsl(var(--accent))" strokeWidth={2} />
          </LineChart>
        </ChartCard>
      )}

      <section className="panel p-5">
        <h2 className="font-display text-lg font-bold">Blood markers over time</h2>
        {labsSorted.length > 1 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-2">Marker</th>
                  {labsSorted.map((l) => (
                    <th key={l.date} className="py-2">
                      {l.date}
                    </th>
                  ))}
                  <th className="py-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {LAB_FIELDS.map((f) => {
                  const first = labsSorted.find((l) => l[f.key] != null)?.[f.key] as
                    | number
                    | undefined;
                  const last = [...labsSorted].reverse().find((l) => l[f.key] != null)?.[f.key] as
                    | number
                    | undefined;
                  const delta =
                    first != null && last != null && first !== last
                      ? (last - first).toFixed(1)
                      : "—";
                  return (
                    <tr key={String(f.key)} className="border-t border-border/60">
                      <td className="py-2 text-muted-foreground">{f.label}</td>
                      {labsSorted.map((l) => (
                        <td key={l.date} className="py-2">
                          {(l[f.key] as number | undefined) ?? "—"}
                        </td>
                      ))}
                      <td className="py-2 font-medium">{delta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Add a second lab panel after your 50-day retest to compare side by side.
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LAB_FIELDS.map((f) => (
            <div key={String(f.key)}>
              <Label className="text-xs">{f.label}</Label>
              <Input
                inputMode="decimal"
                value={labs[f.key as string] ?? ""}
                onChange={(e) => setLabs((s) => ({ ...s, [f.key as string]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={saveLabs}>
          Save blood work
        </Button>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-lg font-bold">Wearable &amp; recovery</h2>
        {state.wearable.connected ? (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Connected to {state.wearable.provider}. Sleep and HRV drive your daily readiness
              score.
            </p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wearableData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="recovery" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="hrv" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Sync a wearable to import sleep and HRV and unlock daily recovery scores plus stress
              alerts.
            </p>
            <Button className="mt-3" onClick={connectWearable}>
              Sync wearable
            </Button>
          </>
        )}
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-lg font-bold">Notifications</h2>
        <div className="mt-3 space-y-4">
          <ToggleRow
            label="Hydration reminders"
            checked={state.settings.waterReminders}
            onChange={(v) => setSettings({ waterReminders: v })}
          />
          <div>
            <Label className="text-xs">Reminder interval (minutes)</Label>
            <Input
              inputMode="numeric"
              value={state.settings.reminderInterval}
              onChange={(e) =>
                setSettings({ reminderInterval: Math.max(15, Number(e.target.value) || 90) })
              }
            />
          </div>
          <ToggleRow
            label="Stress / low-recovery alerts"
            checked={state.settings.stressAlerts}
            onChange={(v) => setSettings({ stressAlerts: v })}
          />
          <ToggleRow
            label="Workout nudges"
            checked={state.settings.workoutNudge}
            onChange={(v) => setSettings({ workoutNudge: v })}
          />
        </div>
        <Button
          variant="destructive"
          className="mt-6"
          onClick={() => {
            reset();
            toast.success("All data cleared");
          }}
        >
          Reset all data
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Educational tracking only — not medical advice. Confirm changes with your clinician.
        </p>
      </section>
    </div>
  );
}

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
} as const;

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <section className="panel p-5">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
