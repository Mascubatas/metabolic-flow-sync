import type { Plan, Profile } from "./types";

const ACTIVITY_FACTOR: Record<Profile["activity"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function todayKey(d: Date = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string) {
  return Math.round(
    (new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000,
  );
}

export function generatePlan(p: Profile): Plan {
  const bmr =
    10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTOR[p.activity];

  const losing = p.targetWeight < p.weight;
  const deficit = losing ? Math.min(600, Math.max(300, (p.weight - p.targetWeight) * 25)) : -250;
  let calories = Math.round((tdee - deficit) / 10) * 10;
  calories = Math.max(calories, Math.round(bmr * 1.05));

  const notes: string[] = [];
  const has = (c: string) => p.conditions.includes(c as never);

  const lowGlycemic = has("diabetes");
  const renal = has("renal");
  const cardio = has("cardio") || has("hypertension");
  const thyroid = has("thyroid");

  let proteinPerKg = 1.8;
  if (renal) {
    proteinPerKg = 0.8;
    notes.push("Protein capped at 0.8 g/kg for kidney protection — confirm with your doctor.");
  }
  const protein = Math.round(p.weight * proteinPerKg);

  let carbPct = lowGlycemic ? 0.3 : 0.4;
  if (lowGlycemic) notes.push("Carbohydrates kept low-glycemic and spread across meals.");
  if (cardio) notes.push("Sodium under 2 g/day and saturated fat kept low.");
  if (thyroid) notes.push("Take thyroid medication fasted, 45 min before food or coffee.");

  const carbs = Math.round((calories * carbPct) / 4);
  const fat = Math.round((calories - protein * 4 - carbs * 4) / 9);

  let water = Math.round((p.weight * 35) / 250) * 250;
  if (renal) {
    notes.push("Hydration target moderated for renal constraints.");
    water = Math.min(water, 2000);
  }
  if (p.activity === "active" || p.activity === "athlete") water += 500;

  const jointFriendly = p.joints.some((j) => j !== "none");
  const split = jointFriendly
    ? [
        "Upper push — machine & cable, controlled tempo",
        "Zone 2 cardio — bike or incline walk 40 min",
        "Lower body — split squat, hip hinge, no deep loading",
        "Upper pull — supported rows, band work",
        "Mobility + core stability",
        "Zone 2 cardio + stair intervals",
        "Rest & recovery walk",
      ]
    : [
        "Full body strength A",
        "Zone 2 cardio 40 min",
        "Full body strength B",
        "Intervals + core",
        "Full body strength C",
        "Long walk / active recovery",
        "Rest",
      ];

  if (jointFriendly)
    notes.push("Training biased to joint-friendly, low-impact patterns based on your reported areas.");

  return {
    calories,
    protein,
    carbs,
    fat,
    water,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    split,
    jointFriendly,
    lowGlycemic,
    sodiumWatch: cardio,
    proteinCapped: renal,
    bloodworkDate: addDays(p.startDate, 50),
    notes,
  };
}

export interface MitigationInput {
  calories: number;
  carbs: number;
  gi: number;
  alcohol?: boolean;
  sugary?: boolean;
  planCalories: number;
  planCarbs: number;
  lowGlycemic: boolean;
}

export function mitigationsFor(i: MitigationInput): string[] {
  const out: string[] = [];
  const glycemicLoad = (i.gi * i.carbs) / 100;

  if (glycemicLoad >= 20)
    out.push("Take a 15-minute brisk walk or stair climb within 30 min of eating.");
  else if (glycemicLoad >= 10) out.push("Add 10 minutes of light movement after this meal.");

  if (i.carbs > i.planCarbs * 0.35)
    out.push(
      `Reduce remaining carbs today by ~${Math.round(i.carbs * 0.5)} g — shift to protein and vegetables.`,
    );

  if (i.calories > i.planCalories * 0.3)
    out.push("Make the next meal protein + greens only, no starch.");

  if (i.sugary) out.push("Drink 500 mL extra water now to blunt the sugar load.");
  if (i.alcohol)
    out.push("Add 500 mL water per drink and skip fasted training tomorrow morning.");

  if (i.lowGlycemic && glycemicLoad >= 15)
    out.push("Check glucose 90 minutes post-meal and note the response.");

  if (out.length === 0) out.push("Impact is small — stay on plan and keep hydration steady.");
  return out;
}

export function recoveryScore(sleep: number, hrv: number, restingHr: number) {
  const s = Math.min(100, (sleep / 8) * 100);
  const h = Math.min(100, (hrv / 70) * 100);
  const r = Math.max(0, 100 - (restingHr - 50) * 3);
  return Math.round(s * 0.4 + h * 0.4 + r * 0.2);
}
