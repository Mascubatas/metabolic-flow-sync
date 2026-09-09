import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Beaker,
  Check,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Pill,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { generatePlan, todayKey } from "@/lib/calc";
import type {
  ActivityLevel,
  Condition,
  JointIssue,
  Medication,
  Profile,
  Sex,
} from "@/lib/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Health screening & plan setup — Metabolix" },
      {
        name: "description",
        content:
          "Answer a short biometric, medical and lab-work screening to generate your adaptive metabolic plan.",
      },
      { property: "og:title", content: "Health screening & plan setup — Metabolix" },
      {
        property: "og:description",
        content: "Biometrics, conditions, joint health, medications and baseline blood markers.",
      },
    ],
  }),
  component: Onboarding,
});

const CONDITIONS: { id: Condition; label: string; note: string }[] = [
  { id: "diabetes", label: "Diabetes / Pre-diabetes", note: "Low-glycemic plan" },
  { id: "thyroid", label: "Thyroid disorder", note: "Medication timing" },
  { id: "cardio", label: "Cardiovascular condition", note: "Sodium & intensity caps" },
  { id: "renal", label: "Kidney / renal constraints", note: "Protein & fluid limits" },
  { id: "hypertension", label: "High blood pressure", note: "Sodium watch" },
];

const JOINTS: { id: JointIssue; label: string }[] = [
  { id: "tendon", label: "Tendon discomfort" },
  { id: "knee", label: "Knee pain" },
  { id: "shoulder", label: "Shoulder issues" },
  { id: "lower-back", label: "Lower back issues" },
  { id: "hip", label: "Hip stiffness" },
  { id: "wrist", label: "Wrist / elbow" },
];

const ACTIVITIES: { id: ActivityLevel; label: string; detail: string }[] = [
  { id: "sedentary", label: "Sedentary", detail: "Desk work, little movement" },
  { id: "light", label: "Light", detail: "1–2 sessions per week" },
  { id: "moderate", label: "Moderate", detail: "3–4 sessions per week" },
  { id: "active", label: "Active", detail: "5–6 sessions per week" },
  { id: "athlete", label: "Athlete", detail: "Twice daily training" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
        active
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Onboarding() {
  const { setProfile, hydrated } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [age, setAge] = useState("38");
  const [sex, setSex] = useState<Sex>("male");
  const [height, setHeight] = useState("178");
  const [weight, setWeight] = useState("92");
  const [target, setTarget] = useState("80");
  const [activity, setActivity] = useState<ActivityLevel>("light");

  const [conditions, setConditions] = useState<Condition[]>([]);
  const [joints, setJoints] = useState<JointIssue[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [medDraft, setMedDraft] = useState({
    name: "",
    dose: "",
    schedule: "daily" as Medication["schedule"],
    timeOfDay: "08:00",
  });

  const [labs, setLabs] = useState<Record<string, string>>({});
  const setLab = (k: string, v: string) => setLabs((l) => ({ ...l, [k]: v }));

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((a) => a !== v) : [...arr, v]);

  const num = (v: string) => (v.trim() === "" ? undefined : Number(v));

  function buildBiomarkers(src: Record<string, string>) {
    const out: Record<string, number> = {};
    for (const k of ["hba1c","glucose","insulin","ldl","hdl","triglycerides","egfr","urea","uricAcid"]) {
      const n = num(src[k] ?? "");
      if (n !== undefined && !Number.isNaN(n)) out[k] = n;
    }
    return out as Biomarkers;
  }

  const profile: Profile = {
    name: name || "Athlete",
    age: Number(age) || 35,
    sex,
    height: Number(height) || 175,
    weight: Number(weight) || 80,
    targetWeight: Number(target) || 75,
    activity,
    conditions,
    joints,
    medications: meds,
    biomarkers: buildBiomarkers(labs),
    startDate: todayKey(),
  };

  const preview = generatePlan(profile);

  const steps = ["Biometrics", "Health", "Biomarkers", "Your plan"];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Health screening</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Four short steps. Everything stays on this device.
        </p>
      </div>

      <div className="flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
              aria-hidden
            />
            <p
              className={`mt-1.5 text-[11px] ${i === step ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <section className="panel space-y-4 p-5">
          <div className="flex items-center gap-2 text-primary">
            <Activity className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Core biometrics</h2>
          </div>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age">
              <Input value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" />
            </Field>
            <Field label="Sex">
              <div className="grid grid-cols-2 gap-2">
                {(["male", "female"] as Sex[]).map((s) => (
                  <Chip key={s} active={sex === s} onClick={() => setSex(s)}>
                    <span className="capitalize">{s}</span>
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Height (cm)">
              <Input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            <Field label="Weight (kg)">
              <Input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            <Field label="Target weight (kg)">
              <Input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                inputMode="numeric"
              />
            </Field>
          </div>
          <Field label="Baseline activity">
            <div className="grid gap-2 sm:grid-cols-2">
              {ACTIVITIES.map((a) => (
                <Chip key={a.id} active={activity === a.id} onClick={() => setActivity(a.id)}>
                  <div className="font-medium text-foreground">{a.label}</div>
                  <div className="text-[11px] text-muted-foreground">{a.detail}</div>
                </Chip>
              ))}
            </div>
          </Field>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <div className="panel space-y-3 p-5">
            <div className="flex items-center gap-2 text-primary">
              <HeartPulse className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Pre-existing conditions
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {CONDITIONS.map((c) => (
                <Chip
                  key={c.id}
                  active={conditions.includes(c.id)}
                  onClick={() => toggle(conditions, c.id, setConditions)}
                >
                  <div className="font-medium text-foreground">{c.label}</div>
                  <div className="text-[11px] text-muted-foreground">{c.note}</div>
                </Chip>
              ))}
            </div>
          </div>

          <div className="panel space-y-3 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Musculoskeletal &amp; joint health
            </h2>
            <p className="text-xs text-muted-foreground">
              Selected areas automatically switch your training to joint-friendly protocols.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {JOINTS.map((j) => (
                <Chip
                  key={j.id}
                  active={joints.includes(j.id)}
                  onClick={() => toggle(joints, j.id, setJoints)}
                >
                  {j.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="panel space-y-3 p-5">
            <div className="flex items-center gap-2 text-primary">
              <Pill className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">Medications</h2>
            </div>
            {meds.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.dose} · {m.schedule} · {m.timeOfDay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMeds(meds.filter((x) => x.id !== m.id))}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${m.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Medication name"
                value={medDraft.name}
                onChange={(e) => setMedDraft({ ...medDraft, name: e.target.value })}
              />
              <Input
                placeholder="Dose (e.g. 500 mg)"
                value={medDraft.dose}
                onChange={(e) => setMedDraft({ ...medDraft, dose: e.target.value })}
              />
              <select
                className="h-9 rounded-md border border-input bg-secondary/40 px-3 text-sm"
                value={medDraft.schedule}
                onChange={(e) =>
                  setMedDraft({ ...medDraft, schedule: e.target.value as Medication["schedule"] })
                }
              >
                <option value="daily">Every day</option>
                <option value="alternate">Alternate days</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As needed</option>
              </select>
              <Input
                type="time"
                value={medDraft.timeOfDay}
                onChange={(e) => setMedDraft({ ...medDraft, timeOfDay: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                if (!medDraft.name.trim()) return;
                setMeds([...meds, { id: crypto.randomUUID(), ...medDraft }]);
                setMedDraft({ name: "", dose: "", schedule: "daily", timeOfDay: "08:00" });
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add medication
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="panel space-y-4 p-5">
          <div className="flex items-center gap-2 text-primary">
            <Beaker className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Baseline blood work (optional)
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["hba1c", "HbA1c (%)"],
              ["glucose", "Fasting glucose (mg/dL)"],
              ["insulin", "Fasting insulin (µIU/mL)"],
              ["ldl", "LDL (mg/dL)"],
              ["hdl", "HDL (mg/dL)"],
              ["triglycerides", "Triglycerides (mg/dL)"],
              ["egfr", "eGFR (mL/min)"],
              ["urea", "Urea (mg/dL)"],
              ["uricAcid", "Uric acid (mg/dL)"],
            ].map(([k, label]) => (
              <Field key={k} label={label!}>
                <Input
                  inputMode="decimal"
                  value={labs[k!] ?? ""}
                  onChange={(e) => setLab(k!, e.target.value)}
                  placeholder="—"
                />
              </Field>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Leave blank if unknown. You can add results any time from Trends.
          </p>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <div className="panel glow-primary space-y-4 p-5">
            <h2 className="font-display text-lg font-bold">Your generated program</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Calories", `${preview.calories}`, "kcal / day"],
                ["Protein", `${preview.protein} g`, "daily"],
                ["Carbs", `${preview.carbs} g`, preview.lowGlycemic ? "low-GI" : "daily"],
                ["Water", `${(preview.water / 1000).toFixed(1)} L`, "daily"],
              ].map(([a, b, c]) => (
                <div key={a} className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-[11px] uppercase text-muted-foreground">{a}</p>
                  <p className="font-display text-lg font-bold">{b}</p>
                  <p className="text-[11px] text-muted-foreground">{c}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Weekly training split
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {preview.split.map((s, i) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-primary">D{i + 1}</span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            {preview.notes.length > 0 && (
              <div className="rounded-xl border border-warn/40 bg-warn/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                  Safety adaptations
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                  {preview.notes.map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Follow-up blood work scheduled in 50 days ({preview.bloodworkDate}).
            </p>
          </div>
        </section>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        )}
        {step < 3 ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="flex-1"
            disabled={!hydrated}
            onClick={() => {
              setProfile(profile);
              navigate({ to: "/" });
            }}
          >
            <Check className="mr-1 h-4 w-4" /> Start my 50-day plan
          </Button>
        )}
      </div>
      <p className="pb-2 text-center text-[11px] text-muted-foreground">
        Educational tool only — not medical advice. Confirm changes with your physician.
      </p>
    </div>
  );
}
