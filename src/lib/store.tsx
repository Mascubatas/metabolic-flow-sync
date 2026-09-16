import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  CheckIn,
  DayLog,
  FoodLogEntry,
  Plan,
  Profile,
  Settings,
  WorkoutLog,
  BiomarkerEntry,
} from "./types";
import { generatePlan, todayKey } from "./calc";

const KEY = "mfo-tracker-v1";

const emptyState: AppState = {
  profile: null,
  plan: null,
  days: {},
  food: [],
  workouts: {},
  checkIns: [],
  labs: [],
  wearable: { connected: false, provider: "", days: [] },
  settings: {
    waterReminders: true,
    reminderInterval: 90,
    stressAlerts: true,
    workoutNudge: true,
  },
  trainingVolumeFactor: 1,
  blockedPatterns: [],
};

interface Ctx {
  hydrated: boolean;
  state: AppState;
  today: DayLog;
  setProfile: (p: Profile) => void;
  update: (fn: (s: AppState) => AppState) => void;
  updateDay: (fn: (d: DayLog) => DayLog) => void;
  addFood: (e: FoodLogEntry) => void;
  removeFood: (id: string) => void;
  logWorkout: (w: WorkoutLog) => void;
  addCheckIn: (c: CheckIn) => void;
  addLabs: (l: BiomarkerEntry) => void;
  setSettings: (s: Partial<Settings>) => void;
  reset: () => void;
}

const StoreContext = createContext<Ctx | null>(null);

function emptyDay(date: string): DayLog {
  return { date, water: 0, habits: {}, meds: {} };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...emptyState, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full */
    }
  }, [state, hydrated]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), []);

  const date = todayKey();
  const today = state.days[date] ?? emptyDay(date);

  const value = useMemo<Ctx>(
    () => ({
      hydrated,
      state,
      today,
      setProfile: (p: Profile) => {
        const plan: Plan = generatePlan(p);
        setState((s) => ({
          ...s,
          profile: p,
          plan,
          labs:
            Object.values(p.biomarkers).some((v) => typeof v === "number")
              ? [{ date: p.startDate, ...p.biomarkers }, ...s.labs]
              : s.labs,
        }));
      },
      update,
      updateDay: (fn) =>
        setState((s) => ({
          ...s,
          days: { ...s.days, [date]: fn(s.days[date] ?? emptyDay(date)) },
        })),
      addFood: (e) => setState((s) => ({ ...s, food: [e, ...s.food] })),
      removeFood: (id) => setState((s) => ({ ...s, food: s.food.filter((f) => f.id !== id) })),
      logWorkout: (w) => setState((s) => ({ ...s, workouts: { ...s.workouts, [w.date]: w } })),
      addCheckIn: (c) =>
        setState((s) => {
          const prev = s.checkIns[0];
          let factor = s.trainingVolumeFactor;
          if (prev && c.tendonPain > prev.tendonPain && c.tendonPain >= 5)
            factor = Math.max(0.6, factor - 0.15);
          else if (c.tendonPain <= 3) factor = Math.min(1, factor + 0.1);
          return { ...s, checkIns: [c, ...s.checkIns], trainingVolumeFactor: factor };
        }),
      addLabs: (l) => setState((s) => ({ ...s, labs: [l, ...s.labs] })),
      setSettings: (p) => setState((s) => ({ ...s, settings: { ...s.settings, ...p } })),
      reset: () => setState(emptyState),
    }),
    [hydrated, state, today, update, date],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useTotals(date = todayKey()) {
  const { state } = useStore();
  return useMemo(() => {
    const entries = state.food.filter((f) => f.date === date);
    return entries.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        protein: acc.protein + f.protein,
        carbs: acc.carbs + f.carbs,
        fat: acc.fat + f.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [state.food, date]);
}
