export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  target: string;
  video: string; // youtube id
  jointLoad: ("knee" | "shoulder" | "lower-back" | "hip" | "wrist" | "tendon")[];
  jointFriendlyAlt?: string;
}

export interface WorkoutDay {
  id: string;
  title: string;
  focus: string;
  minutes: number;
  exercises: Exercise[];
}

export const WORKOUTS: WorkoutDay[] = [
  {
    id: "w0",
    title: "Upper Push",
    focus: "Chest, shoulders, triceps",
    minutes: 50,
    exercises: [
      { id: "e1", name: "Machine chest press", sets: 4, reps: "8-10", target: "Chest", video: "xUm0BiZCWlQ", jointLoad: ["shoulder"] },
      { id: "e2", name: "Incline dumbbell press", sets: 3, reps: "10", target: "Upper chest", video: "8iPEnn-ltC8", jointLoad: ["shoulder"], jointFriendlyAlt: "Neutral-grip machine press" },
      { id: "e3", name: "Cable lateral raise", sets: 3, reps: "12-15", target: "Side delts", video: "3VcKaXpzqRo", jointLoad: ["shoulder"] },
      { id: "e4", name: "Rope triceps pushdown", sets: 3, reps: "12", target: "Triceps", video: "2-LAMcpzODU", jointLoad: ["tendon", "wrist"] },
    ],
  },
  {
    id: "w1",
    title: "Zone 2 Cardio",
    focus: "Aerobic base, insulin sensitivity",
    minutes: 40,
    exercises: [
      { id: "e5", name: "Incline treadmill walk", sets: 1, reps: "40 min @ Z2", target: "Aerobic system", video: "kFcnG-XjLOQ", jointLoad: [] },
      { id: "e6", name: "Stationary bike steady", sets: 1, reps: "40 min", target: "Aerobic system", video: "0mQ6TU-Vsm4", jointLoad: ["knee"] },
    ],
  },
  {
    id: "w2",
    title: "Lower Body",
    focus: "Quads, glutes, hamstrings",
    minutes: 55,
    exercises: [
      { id: "e7", name: "Goblet squat", sets: 4, reps: "8-10", target: "Quads, glutes", video: "MeIiIdhvXT4", jointLoad: ["knee", "lower-back"], jointFriendlyAlt: "Leg press with limited range" },
      { id: "e8", name: "Romanian deadlift", sets: 3, reps: "8", target: "Hamstrings", video: "JCXUYuzwNrM", jointLoad: ["lower-back", "hip"], jointFriendlyAlt: "Seated leg curl" },
      { id: "e9", name: "Bulgarian split squat", sets: 3, reps: "10 / side", target: "Glutes", video: "2C-uNgKwPLE", jointLoad: ["knee", "hip"], jointFriendlyAlt: "Step-ups on low box" },
      { id: "e10", name: "Standing calf raise", sets: 3, reps: "15", target: "Calves", video: "-M4-G8p8fmc", jointLoad: ["tendon"] },
    ],
  },
  {
    id: "w3",
    title: "Upper Pull",
    focus: "Back, biceps, rear delts",
    minutes: 50,
    exercises: [
      { id: "e11", name: "Chest-supported row", sets: 4, reps: "10", target: "Mid back", video: "vFcx-cQyeQU", jointLoad: [] },
      { id: "e12", name: "Lat pulldown", sets: 3, reps: "10-12", target: "Lats", video: "CAwf7n6Luuc", jointLoad: ["shoulder"] },
      { id: "e13", name: "Face pull", sets: 3, reps: "15", target: "Rear delts", video: "rep-qVOkqgk", jointLoad: [] },
      { id: "e14", name: "Incline dumbbell curl", sets: 3, reps: "12", target: "Biceps", video: "soxrZlIl35U", jointLoad: ["tendon", "wrist"], jointFriendlyAlt: "Cable curl with neutral bar" },
    ],
  },
  {
    id: "w4",
    title: "Mobility & Core",
    focus: "Stability, joint health",
    minutes: 35,
    exercises: [
      { id: "e15", name: "Dead bug", sets: 3, reps: "10 / side", target: "Deep core", video: "4XLEnwUr1d8", jointLoad: [] },
      { id: "e16", name: "Bird dog", sets: 3, reps: "10 / side", target: "Spinal stability", video: "wiFNA3sqjCA", jointLoad: [] },
      { id: "e17", name: "90/90 hip switch", sets: 3, reps: "8 / side", target: "Hips", video: "iBGz-U-oceE", jointLoad: ["hip"] },
      { id: "e18", name: "Side plank", sets: 3, reps: "30 s", target: "Obliques", video: "K2VljzCC16g", jointLoad: ["shoulder"] },
    ],
  },
  {
    id: "w5",
    title: "Cardio + Stairs",
    focus: "Glucose disposal, conditioning",
    minutes: 40,
    exercises: [
      { id: "e19", name: "Stair climbing intervals", sets: 6, reps: "2 min up / 2 min easy", target: "Legs, heart", video: "TzM1PdcOFrQ", jointLoad: ["knee"] },
      { id: "e20", name: "Rowing machine steady", sets: 1, reps: "15 min", target: "Full body", video: "H0r_ZPXJLtg", jointLoad: ["lower-back"], jointFriendlyAlt: "Elliptical steady state" },
    ],
  },
  {
    id: "w6",
    title: "Recovery Walk",
    focus: "Active recovery",
    minutes: 30,
    exercises: [
      { id: "e21", name: "Outdoor brisk walk", sets: 1, reps: "30 min", target: "Recovery", video: "kFcnG-XjLOQ", jointLoad: [] },
    ],
  },
];

export const REPLACEMENTS = [
  { id: "alt1", name: "Home bodyweight circuit", detail: "3 rounds: 15 squats, 10 push-ups, 20 s plank, 20 lunges" },
  { id: "alt2", name: "Stair climbing", detail: "20 minutes continuous, moderate pace" },
  { id: "alt3", name: "Zone 2 walk", detail: "45 minutes brisk walking, conversational pace" },
  { id: "alt4", name: "Resistance band session", detail: "Rows, presses, pull-aparts — 4 exercises x 3 sets" },
  { id: "alt5", name: "Mobility & stretching", detail: "25 minutes joint-friendly mobility flow" },
];
