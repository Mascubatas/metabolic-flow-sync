export type Sex = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";

export type Condition =
  | "diabetes"
  | "thyroid"
  | "cardio"
  | "renal"
  | "hypertension"
  | "none";

export type JointIssue =
  | "tendon"
  | "knee"
  | "shoulder"
  | "lower-back"
  | "hip"
  | "wrist"
  | "none";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  schedule: "daily" | "alternate" | "weekly" | "as-needed";
  timeOfDay: string;
}

export interface Biomarkers {
  hba1c?: number;
  glucose?: number;
  insulin?: number;
  ldl?: number;
  hdl?: number;
  triglycerides?: number;
  egfr?: number;
  urea?: number;
  uricAcid?: number;
}

export interface BiomarkerEntry extends Biomarkers {
  date: string;
}

export interface Profile {
  name: string;
  age: number;
  sex: Sex;
  height: number;
  weight: number;
  targetWeight: number;
  activity: ActivityLevel;
  conditions: Condition[];
  joints: JointIssue[];
  medications: Medication[];
  biomarkers: Biomarkers;
  startDate: string;
}

export interface Plan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // mL
  bmr: number;
  tdee: number;
  split: string[];
  jointFriendly: boolean;
  lowGlycemic: boolean;
  sodiumWatch: boolean;
  proteinCapped: boolean;
  bloodworkDate: string;
  notes: string[];
}

export interface FoodLogEntry {
  id: string;
  date: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  gi: number;
  offPlan: boolean;
  mitigations: string[];
}

export interface WorkoutLog {
  date: string;
  status: "done" | "skipped" | "replaced";
  replacement?: string;
  note?: string;
}

export interface DayLog {
  date: string;
  water: number; // glasses of 250ml
  weight?: number;
  habits: Record<string, boolean>;
  meds: Record<string, boolean>;
}

export interface CheckIn {
  date: string;
  tendonPain: number;
  jointStiffness: number;
  energy: number;
  sleep: number;
  notes: string;
}

export interface Wearable {
  connected: boolean;
  provider: string;
  days: { date: string; sleep: number; hrv: number; restingHr: number; steps: number }[];
}

export interface Settings {
  waterReminders: boolean;
  reminderInterval: number; // minutes
  stressAlerts: boolean;
  workoutNudge: boolean;
}

export interface AppState {
  profile: Profile | null;
  plan: Plan | null;
  days: Record<string, DayLog>;
  food: FoodLogEntry[];
  workouts: Record<string, WorkoutLog>;
  checkIns: CheckIn[];
  labs: BiomarkerEntry[];
  wearable: Wearable;
  settings: Settings;
  trainingVolumeFactor: number;
  blockedPatterns: string[];
}
